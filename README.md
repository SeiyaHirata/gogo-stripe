# GoGoLamp - Real-time Stripe Payment Notification System

A real-time payment visualization system that lights up when Stripe webhooks are received. Features visual and audio notifications with a modern, animated interface.

## Features

- 🔴 Real-time payment notifications via Stripe webhooks
- 🎵 Audio alerts on payment receipt
- 💡 Visual lamp animation with custom images
- 📊 Payment history tracking
- 🌐 Socket.IO for instant communication
- 🎨 Modern UI with Framer Motion animations
- 💳 Secure webhook signature verification

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + Socket.IO
- **Storage**: In-memory storage (easily extensible to PostgreSQL)
- **UI**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Payment Processing**: Stripe webhooks

## Prerequisites

- Node.js 18+ and npm
- Stripe account with webhook endpoint configured

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...                    # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...                  # Webhook endpoint secret
VITE_STRIPE_PUBLIC_KEY=pk_test_...               # Your Stripe publishable key

# Development
NODE_ENV=development
```

### Getting Stripe API Keys

1. Go to [Stripe Dashboard API Keys](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** (starts with `pk_`) for `VITE_STRIPE_PUBLIC_KEY`
3. Copy your **Secret key** (starts with `sk_`) for `STRIPE_SECRET_KEY`
4. For webhooks:
   - Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
   - Create a new webhook endpoint pointing to `https://your-domain.com/api/webhook`
   - Select events: `payment_intent.succeeded`
   - Copy the **Signing secret** (starts with `whsec_`) for `STRIPE_WEBHOOK_SECRET`

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gogolamp.git
   cd gogolamp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## Deployment

### Replit Deployment (Recommended)

1. Import this repository to Replit
2. Set environment variables in the Secrets tab
3. Click "Deploy" to create a production deployment
4. Use the deployment URL as your Stripe webhook endpoint

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set up your production environment variables

3. Start the production server:
   ```bash
   npm start
   ```

## Configuration

### Custom Images

Replace the default lamp images in `client/public/images/`:
- `lamp-off.png` - Image shown when no payment is detected
- `lamp-on.png` - Image shown when payment is received

### Audio

Replace the payment sound in `client/public/sounds/`:
- `payment-sound.m4a` - Sound played when payment is received

### Webhook Events

The system listens for these Stripe events:
- `payment_intent.succeeded` - Triggers the lamp activation

## API Endpoints

- `GET /api/payments` - Fetch payment history
- `POST /api/webhook` - Stripe webhook endpoint (configured in Stripe dashboard)
- `POST /api/test-payment` - Test endpoint for development

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check
```

## Project Structure

```
├── client/                 # React frontend
│   ├── public/            # Static assets (images, sounds)
│   └── src/
│       ├── components/    # React components
│       ├── pages/         # Application pages
│       └── lib/           # Utilities and configurations
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database interface
├── shared/                # Shared types and schemas
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/gogolamp/issues) page
2. Create a new issue with detailed information about your problem
3. Include your environment details and error messages

## Acknowledgments

- [Stripe](https://stripe.com) for payment processing
- [Socket.IO](https://socket.io) for real-time communication
- [Framer Motion](https://www.framer.com/motion/) for animations
- [shadcn/ui](https://ui.shadcn.com) for UI components