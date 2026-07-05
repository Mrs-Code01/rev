import { getSession } from "@/lib/session";
import { SplashScreen } from "./SplashScreen";

export default async function SplashPage() {
  const session = await getSession();
  return <SplashScreen nextHref={session ? "/home" : "/login"} />;
}
