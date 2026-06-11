import TapLoadingClient from "./TapLoadingClient";

export default async function TapPage({
  params,
}: {
  params: Promise<{ bandId: string }>;
}) {
  const { bandId } = await params;

  return <TapLoadingClient bandId={bandId} />;
}