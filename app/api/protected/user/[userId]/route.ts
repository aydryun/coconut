import { NextResponse } from "next/server";
import { getUserInformations } from "@/app/backend/surreal-actions";
// Simulation d'une base de données

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  try {
    const userInformations = await getUserInformations(userId);

    if (!userInformations) {
      return NextResponse.json(
        { error: "Utilisateur inexistant" },
        { status: 404 },
      );
    }

    return NextResponse.json(userInformations);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la recuperation d'un joueur" },
      { status: 500 },
    );
  }
}
