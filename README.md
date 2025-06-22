# SkriptStore

SkriptStore is a modern marketplace platform built with Next.js 15.3.4, designed for developers to share, sell, and discover code scripts and tools.

## Features

- 🛍️ **Script Marketplace**: Browse, purchase, and sell code scripts
- 🎨 **Modern UI**: Built with Radix UI components and Tailwind CSS
- 🌙 **Dark/Light Mode**: Full theme support with next-themes
- 📊 **Analytics Dashboard**: Track your script performance
- 🔒 **Authentication**: Secure user authentication system
- 💾 **PostgreSQL Database**: Powered by Drizzle ORM
- 📱 **Responsive Design**: Mobile-first approach

## Tech Stack

- **Framework**: Next.js 15.3.4
- **Language**: TypeScript
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **State Management**: SWR
- **Charts**: Recharts
- **Markdown**: React Markdown

## Getting Started

### Prerequisites

- Node.js 18 or later
- PostgreSQL database
- Bun (recommended) or npm/pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/skriptstore.git
   cd skriptstore
   ```

2. Install dependencies:

   ```bash
   bun install
   # or npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/skriptstore
   # Add other required environment variables
   ```

4. Run database migrations:

   ```bash
   bun run db:migrate
   ```

5. Start the development server:
   ```bash
   bun dev
   # or npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components
│   ├── product-comp/  # Product-related components
│   └── sidebar/       # Navigation components
├── db/                # Database configuration and schema
├── hooks/             # Custom React hooks
├── lib/              # Utility functions and types
└── scripts/          # Database and utility scripts
```

## Key Features Explained

### Authentication

The application uses Better Auth for secure user authentication, supporting only social logins.

### Product Management

- Browse products in the marketplace
- Create and edit product listings
- Like and purchase products
- Track product analytics

### User Dashboard

- View purchased products
- Monitor product performance
- Manage product listings
- Connect payment methods

### Developer Features

- API documentation
- Developer tools and resources
- Analytics integration

## API Documentation

### Authentication

- **POST /api/auth/**
  - Handles user authentication (login, register, social logins, etc.)
  - Powered by Better Auth
  - Accepts and returns JSON

### Products

- **GET /api/products**

  - Returns a list of products
  - Query parameters:
    - `search`: string (search by title/description)
    - `games`: comma-separated list (filter by games)
    - `categories`: comma-separated list (filter by categories)
    - `priceRange`: JSON string (e.g., `[min, max]`)
    - `sortBy`: string (e.g., `popular`, `latest`)
  - Example: `/api/products?search=editor&sortBy=latest`

- **GET /api/products/latest**

  - Returns the latest 6 products

- **POST /api/products/[id]/like**
  - Toggle like/unlike for a product by ID
  - Requires authentication
  - Returns success or error

### User

- **GET /api/user/liked-products**

  - Returns a list of products liked by the authenticated user
  - Requires authentication

- **GET /api/user/purchased-products**
  - Returns a list of products purchased by the authenticated user
  - Requires authentication

#### Example Response: `/api/products`

```json
[
  {
    "id": "prod_123",
    "title": "Script Name",
    "thumbnail": "/public/script.png",
    "price": 19.99,
    "createdAt": "2025-06-22T12:00:00Z"
  },
  ...
]
```

#### Error Response

```json
{
  "error": "Not authenticated"
}
```

For more details, see the code in `src/app/api/`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
