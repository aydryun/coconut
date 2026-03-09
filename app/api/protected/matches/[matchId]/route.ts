import { NextResponse } from "next/server";
import {
  deleteMatch,
  getMatchInformations,
  updateMatchInformations,
} from "@/app/backend/surreal-actions";

/**
 * GET /api/protected/matches/{matchId}
 *
 * Récuperation des informations d'un match
 * @param matchData
 * @returns
 *
 */
export async function GET(
  request: Request,
  { params }: { params: { matchId: string } },
) {
  const matchId = await params.matchId;

  const matchInformations = await getMatchInformations(matchId);

  return NextResponse.json(matchInformations);
}

/**
 * PATCH /api/protected/matches/{matchId}
 * //TODO
 * Modification d'un match
 * @param matchData
 * @returns
 *
 */
export async function PATCH(
  request: Request,
  { params }: { params: { matchId: string } },
) {
  try {
    const updateData = await request.json();
    const { matchId } = await params;

    const updateInformations = await updateMatchInformations(
      `Match:${matchId}`,
      updateData,
    );
    return NextResponse.json(updateInformations);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du match" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/protected/matches/{matchId}
 *
 * Suppression d'un match et tout ses rounds
 * @param matchData
 * @returns
 *
 */
export async function DELETE(
  request: Request,
  { params }: { params: { matchId: string } },
) {
  const { matchId } = await params;

  deleteMatch(`Match:${matchId}`);

  return NextResponse.json({ message: "Match supprimé avec succès" });
}
