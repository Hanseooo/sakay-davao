import { 
  Route, 
  MapPin, 
  Navigation2, 
  Info 
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function About() {
  const modes = [
    {
      title: "Explore Routes",
      description: "Visualize the entire Davao bus network with color-coded paths and an interactive map legend.",
      icon: <Route className="w-6 h-6 text-blue-500" />,
      features: ["Route highlighting", "Stop visualization", "Interactive list"]
    },
    // {
    //   title: "Nearby Stops",
    //   description: "Instantly find the closest bus stops using your device's GPS location or a custom search radius.",
    //   icon: <MapPin className="w-6 h-6 text-red-500" />,
    //   features: ["Live GPS sorting", "Radius selection", "Stop details"]
    // },
    {
      title: "Find Routes", 
      description: "Check if a single bus line directly connects your origin and destination.",
      icon: <Navigation2 className="w-6 h-6 text-green-500" />,
      features: ["Zero-transfer check", "Origin-Destination match", "Route snapping"]
    }
  ]

  return (
    <section className="w-full py-12 md:py-24 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it Works</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Sakay Davao simplifies your commute by organizing routes into two focused modes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {modes.map((mode, index) => (
          <Card key={index} className="flex flex-col h-full border-none shadow-lg bg-secondary/20 hover:bg-secondary/30 transition-all duration-300">
            <CardHeader>
              <div className="mb-4 p-3 bg-background w-fit rounded-xl shadow-sm">{mode.icon}</div>
              <CardTitle className="text-xl">{mode.title}</CardTitle>
              <CardDescription className="leading-relaxed text-base">
                {mode.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <ul className="space-y-3">
                {mode.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mr-2.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 flex flex-col md:flex-row items-start gap-4">
        <Info className="w-6 h-6 text-blue-600 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-medium text-blue-900 dark:text-blue-100">Official Data Notice</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This guide utilizes the Davao Interim Bus Service (HPBS) data. Please note that routes and stops may be subject to change. <a rel="noopener noreferrer" target="_blank" href="https://github.com/ttg-eng/routes" className="underline ">Click to view data source</a>
          </p>
        </div>
      </div>
    </section>
  )
}