import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { PhotoForm } from "./PhotoForm";

export default async function ChoosePhotoPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-paper px-6 py-12 lg:flex lg:items-center lg:justify-center lg:px-16">
      <div className="mx-auto flex max-w-md flex-col items-center text-center lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:gap-20 lg:text-left">
        <div className="lg:max-w-sm">
          <p className="kicker">Almost there</p>
          <h1 className="mt-3 font-display text-[32px] font-semibold text-ink lg:text-[42px]">
            Add a photo
          </h1>
          <p className="mt-3 font-serif text-[15px] text-sub">
            A face helps the team recognize whose edition a Slack brief came from.
          </p>
        </div>

        <div className="mt-8">
          <PhotoForm />
        </div>
      </div>
    </div>
  );
}
