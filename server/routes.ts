import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertPaymentSchema } from "@shared/schema";
import express from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup Socket.IO for real-time communication
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Store active connections
  const activeConnections = new Set();
  
  io.on("connection", (socket) => {
    activeConnections.add(socket);
    console.log("Client connected:", socket.id);
    
    socket.on("disconnect", () => {
      activeConnections.delete(socket);
      console.log("Client disconnected:", socket.id);
    });
  });

  // Stripe webhook endpoint
  app.post("/api/webhook/payment", express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      // In production, you would verify the webhook signature
      // For now, we'll parse the event directly for testing
      if (process.env.STRIPE_WEBHOOK_SECRET) {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      } else {
        // For development/testing - parse JSON directly
        event = JSON.parse(req.body.toString());
      }
    } catch (err: any) {
      console.log(`Webhook signature verification failed:`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle payment success
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      try {
        // Store payment in database
        const payment = await storage.createPayment({
          stripePaymentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        });

        // Broadcast to all connected clients
        io.emit('payment_received', {
          type: 'payment_received',
          amount: paymentIntent.amount / 100, // Convert from cents
          currency: paymentIntent.currency,
          timestamp: payment.timestamp,
          paymentId: payment.id
        });

        console.log(`Payment received: $${paymentIntent.amount / 100}`);
        
        res.json({ received: true });
      } catch (error: any) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: error.message });
      }
    } else {
      console.log(`Unhandled event type: ${event.type}`);
      res.json({ received: true });
    }
  });

  // Test endpoint to simulate payment
  app.post("/api/test-payment", async (req, res) => {
    try {
      const { amount = 1000 } = req.body;
      
      // Create a test payment
      const payment = await storage.createPayment({
        stripePaymentId: `test_${Date.now()}`,
        amount: amount * 100, // Convert to cents
        currency: "usd"
      });

      // Broadcast to all connected clients
      io.emit('payment_received', {
        type: 'payment_received',
        amount: amount,
        currency: "usd",
        timestamp: payment.timestamp,
        paymentId: payment.id
      });

      res.json({ success: true, payment });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get recent payments
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getRecentPayments(5);
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
