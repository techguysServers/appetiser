import MobileNavigation from "@/components/landing/nav/MobileNavigation";
import { SignatureExemple } from "@/components/landing/nav/SignatureExemple";
import { AnimatedSubscribeButton } from "@/components/magicui/animated-subscribe-button";
import { Marquee } from "@/components/magicui/marquee";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { SignButton } from "@/components/SignButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Navbar,
  NavBody,
  NavbarLogo,
  NavItems,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { Textarea } from "@/components/ui/textarea";
import { cn, navItems } from "@/lib/utils";
import { Microscope } from "lucide-react";

const modules = [
  {
    name: "Development",
    description:
      "Tools for development estimate. Display tech stack, libraries, frameworks, etc. Benefit from sequential diagrams, and more.",
    icon: "💻",
  },
  {
    name: "Marketing",
    description:
      "Tools for marketing estimate. Display marketing channels, metrics, etc. Add evolution of the marketing metrics over time with graphs and tables.",
    icon: "💰",
  },
  {
    name: "SEO",
    description:
      "Tools for SEO estimate. Display SEO metrics, rankings, results, resources for improvement. Add evolution of the SEO metrics over time with graphs and tables.",
    icon: "🔍",
  },
  {
    name: "Social Media",
    description:
      "Tools for social media estimate. Display social media metrics, engagement, etc. Add evolution of the social media metrics over time with graphs and tables.",
    icon: "💬",
  },
  {
    name: "Analytics",
    description:
      "Tools for analytics estimate. Display analytics metrics, etc. Add evolution of the analytics metrics over time with graphs and tables.",
    icon: "📊",
  },
];

export default function Home() {
  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary" href="/auth/login">
              Login
            </NavbarButton>
            <NavbarButton variant="primary" href="/auth/sign-up">
              Get started
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNavigation />
      </Navbar>
      <div className="scheme-dark relative mx-auto h-screen -mt-[54px]">
        <div className="max-w-7xl mx-auto relative h-full">
          <div className="absolute top-1/2 left-0 -translate-y-1/2">
            <p className="text-lg text-secondary font-semibold">
              How entrepreneurs close deals
            </p>
            <div className="w-20 h-px my-2 bg-secondary" />
            <h1 className="text-6xl font-semibold max-w-xl">
              Power up your estimate with an attractive frontend
            </h1>
            <p className="text-lg mt-14 max-w-lg">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Architecto pariatur molestias quod distinctio! Provident est
              soluta earum quidem! Libero, totam!
            </p>

            <div className="mt-10">
              <RainbowButton size={"lg"}>Get started</RainbowButton>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <p className="text-secondary uppercase text-lg text-center font-mono">
          Revolutionize your client acquisition process
        </p>
        <h2 className="max-w-2xl mx-auto text-4xl font-semibold text-center mt-2 mb-10">
          Create a powerful user interface in addition of your estimate paper
        </h2>

        <div className="w-fit grid grid-cols-[28rem_12rem_28rem] gap-8 mx-auto">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Auto-compute</CardTitle>
              <CardDescription>
                Drop your estimate PDF and the app will auto-compute the
                estimate based on it.
              </CardDescription>
              <FileUpload />
            </CardHeader>
          </Card>
          <Card className="row-span-2 h-full">
            <CardHeader>
              <CardTitle>Sign link</CardTitle>
              <CardDescription>
                Provide a link to sign the estimate directly from the estimate
              </CardDescription>
            </CardHeader>
            <CardContent className="relative h-full flex-1 flex flex-col items-center justify-evenly">
              <div className="">
                <SignatureExemple />
              </div>
              <SignButton
                link={"#"}
                className="px-10 py-6 rounded-xl"
                preventClick
              />
            </CardContent>
          </Card>
          <Card className="row-span-2">
            <CardHeader>
              <CardTitle>Customization</CardTitle>
              <CardDescription>
                <p>
                  Edit the set of steps and the app will refresh the estimate
                  based on it.
                </p>
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="size-48">
            <CardHeader>
              <Microscope className="w-full h-full" strokeWidth={1.2} />
            </CardHeader>
          </Card>
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Modularity</CardTitle>
              <CardDescription>
                Add or remove different module. Suitable for every business
              </CardDescription>
            </CardHeader>
            <div className="relative min-h-56 h-full overflow-hidden">
              <Marquee
                pauseOnHover
                className="absolute top-5 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]"
              >
                {modules.map((m, idx) => (
                  <figure
                    key={idx}
                    className={cn(
                      "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
                      "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                      "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                      "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
                    )}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <div className="flex flex-col">
                        <figcaption className="text-sm font-medium dark:text-white ">
                          {m.name}
                        </figcaption>
                      </div>
                    </div>
                    <blockquote className="mt-2 text-xs">
                      {m.description}
                    </blockquote>
                  </figure>
                ))}
              </Marquee>
            </div>
          </Card>
        </div>
      </div>
      <div className="relative w-full max-w-7xl mx-auto my-64">
        <h1 className="text-7xl font-thin text-center mb-24">
          Tell us about your needs
        </h1>

        <div className="flex flex-col items-end gap-4 w-fit mx-auto">
          <Textarea
            rows={10}
            placeholder="Tell us about your needs"
            className="max-w-2xl min-w-2xl mx-auto"
          />
          <AnimatedSubscribeButton>
            <span>Contact us</span>
            <span>Sent</span>
          </AnimatedSubscribeButton>
        </div>
      </div>
    </div>
  );
}
