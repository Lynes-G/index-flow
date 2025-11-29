import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Palette,
  Shield,
  Smartphone,
  Star,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const features = [
  {
    icon: <Palette className="size-8" />,
    title: "Fully Customizable",
    description:
      "Tailor your link page to reflect your unique style with customizable themes, colors, and layouts.",
  },
  {
    icon: <BarChart3 className="size-8" />,
    title: "Advanced Analytics",
    description:
      "Gain insights into your audience with detailed analytics on link clicks, geographic data, and device usage.",
  },
  {
    icon: <Smartphone className="size-8" />,
    title: "Mobile Friendly",
    description:
      "Ensure your link page looks great and functions seamlessly on all devices, including smartphones and tablets.",
  },
  {
    icon: <Zap className="size-8" />,
    title: "Fast Performance",
    description:
      "Experience lightning-fast load times and smooth interactions, ensuring your link page is always responsive and efficient.",
  },
  {
    icon: <Shield className="size-8" />,
    title: "Secure and Private",
    description:
      "Protect your data and privacy with robust security features and encryption, giving you peace of mind.",
  },
  {
    icon: <Users className="size-8" />,
    title: "Collaborative Features",
    description:
      "Work together with your team seamlessly using shared link management and collaboration tools.",
  },
];

const testimonials = [
  {
    name: "Jane Doe",
    role: "Content Creator",
    content:
      "IndexFlow has transformed the way I share my content online. It's so easy to use and my followers love it!",
    rating: 4,
  },
  {
    name: "John Doe",
    role: "Small Business Owner",
    content:
      "IndexFlow has transformed the way I share my content online. It's so easy to use and my followers love it!",
    rating: 5,
  },
  {
    name: "Jane Foe",
    role: "Artist",
    content:
      "IndexFlow has transformed the way I share my content online. It's so easy to use and my followers love it!",
    rating: 5,
  },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header section */}
      <Header isFixed={true} />

      {/* Hero section */}
      <section className="px-4 py-30 lg:px-8 lg:py-38">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-8 text-center">
            <div className="space-y-6">
              <h1 className="text-5xl leading-tight font-bold text-gray-900 lg:text-7xl dark:text-white">
                One Link,
                <span className="bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Infinite Possibilities.
                </span>
              </h1>
              <div className="mx-auto h-1 w-32 rounded-full bg-linear-to-r from-blue-500 to-purple-600" />
            </div>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 lg:text-2xl dark:text-gray-300">
              Simplify your online presence with a single link that opens doors
              to all your content, profiles, and more. Perfect for sharing on
              social media, email signatures, and business cards.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-auto bg-linear-to-r from-blue-500 to-purple-600 px-4 py-4 text-lg hover:from-blue-600 hover:to-purple-700"
              >
                <Link href="/dashboard">
                  Get Started
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-auto border-purple-600 px-4 py-4 text-lg text-purple-600 hover:bg-purple-600 hover:text-white"
              >
                <Link href="#features">See how it works</Link>
              </Button>
            </div>

            <div className="pt-12">
              <p className="mb-4 text-sm text-gray-500">
                Trusted by thousands of users worldwide
              </p>
              <div className="flex items-center justify-center gap-8 opacity-60">
                <div className="text-2xl font-bold text-gray-400">Creator</div>
                <div className="text-2xl font-bold text-gray-400">Business</div>
                <div className="text-2xl font-bold text-gray-400">
                  Influencer
                </div>
                <div className="text-2xl font-bold text-gray-400">Artist</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
              Everything you need
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Powerful features to enhance your online presence.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl shadow-gray-200/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl"
              >
                <div className="mb-4 text-purple-600">{feature.icon}</div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof section */}
      <section className="px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900 lg:text-5xl">
              Loved by Creators
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about IndexFlow.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl shadow-gray-200/50 backdrop-blur-sm"
              >
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="mb-6 leading-relaxed text-gray-500">
                  {testimonial.content}
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-linear-to-r from-blue-500 to-purple-600 p-12 text-center text-white shadow-2xl shadow-gray-200/50 lg:p-16">
            <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
              Ready to get started?
            </h2>
            <p className="mb-8 text-xl opacity-90">
              Create your IndexFlow link today and take control of your online
              presence.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-auto bg-white px-8 py-6 text-lg font-semibold text-purple-600 hover:bg-gray-100"
              >
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2"
                >
                  Get Started Now <ArrowRight className="size-5" />
                </Link>
              </Button>
            </div>
            <div className="mx-auto mt-8 grid w-fit grid-cols-1 items-center justify-center gap-6 text-sm opacity-80 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4" />
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4" />
                Setup in seconds
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
