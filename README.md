# IndexFlow

IndexFlow is a modern link-in-bio application that allows users to create personalized landing pages with multiple links, customizable themes, and analytics. Simplify your online presence with a single link that directs visitors to all your important content, profiles, and more.

## Features

- **Customizable Link Pages**: Tailor your link page with themes, colors, and layouts to match your brand.
- **Advanced Analytics**: Track link clicks, geographic data, device usage, and more (premium feature).
- **Mobile-Friendly Design**: Responsive design that looks great on all devices.
- **Drag-and-Drop Reordering**: Easily organize your links with intuitive drag-and-drop functionality.
- **User Authentication**: Secure login and user management powered by Clerk.
- **Real-Time Data**: Backend powered by Convex for fast, real-time updates.
- **Profile Customization**: Add profile pictures, descriptions, and accent colors.
- **Link Management**: Create, edit, delete, and reorder links effortlessly.
- **Analytics Dashboard**: View performance metrics like total clicks, unique users, and top links.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Convex (database and serverless functions)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS, Tailwind CSS v4
- **UI Components**: Radix UI, Lucide Icons
- **Form Handling**: React Hook Form, Zod
- **Drag-and-Drop**: @dnd-kit
- **Analytics**: Tinybird (for data aggregation)
- **Deployment**: Vercel (implied)

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm, pnpm, or yarn
- Convex account
- Clerk account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Lynes-G/index-flow.git
   cd index-flow
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Clerk and Convex keys

4. Run the development server:

   ```bash
   pnpm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Convex Setup

1. Install Convex CLI globally:

   ```bash
   npm install -g convex
   ```

2. Initialize Convex:

   ```bash
   convex dev
   ```

3. Follow the prompts to set up your Convex project.

### Clerk Setup

1. Create a Clerk application at [clerk.com](https://clerk.com).
2. Add your Clerk publishable key and secret key to `.env.local`.
3. Configure JWT issuer domain in Convex dashboard.

## Usage

1. **Sign Up/Login**: Use Clerk to authenticate.
2. **Customize Profile**: Set your username, profile picture, description, and accent color.
3. **Add Links**: Create and manage your links in the dashboard.
4. **Reorder Links**: Drag and drop to change link order.
5. **View Analytics**: Access detailed analytics (premium feature).
6. **Share Your Page**: Your public link-in-bio page is available at `/u/[username]`.

## Project Structure

```
index-flow/
├── app/                    # Next.js app directory
│   ├── (app)/              # App routes
│   ├── (auth)/             # Auth routes
│   └── layout.tsx          # Root layout
├── components/             # Reusable UI components
├── convex/                 # Convex backend functions and schema
├── lib/                    # Utility functions
├── schemas/                # Zod schemas for forms
├── styles/                 # Global styles
├── tinybird/               # Analytics pipelines
└── types/                  # TypeScript type definitions
```

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Learn More

- [Convex Documentation](https://docs.convex.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)

For questions or support, join the [Convex Discord community](https://convex.dev/community).

- Follow [Convex on GitHub](https://github.com/get-convex/), star and contribute to the open-source implementation of Convex.
