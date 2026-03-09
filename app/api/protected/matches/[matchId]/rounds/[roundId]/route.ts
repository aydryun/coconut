import { NextResponse } from "next/server";
import {
  deleteRound,
  getRoundInformations,
  updateRoundInformations,
} from "@/app/backend/surreal-actions";

/**
 * GET /api/protected/matches/{matchId}/rounds/{roundId}
 *
 * Récupération des informations d'un round
 * @param matchData
 * @returns
 *
 */
export async function GET(
  request: Request,
  { params }: { params: { matchId: string; roundId: string } },
) {
  const { roundId } = await params;

  // TODO: Check if match exist
  const roundInformations = await getRoundInformations(`Round:${roundId}`);

  return NextResponse.json(roundInformations);
}

/**
 * Modification /api/protected/matches/{matchId}/rounds/{roundId}
 *
 * Modifier les informations d'un round
 * @param matchData
 * @returns
 *
 */
export async function PATCH(
  request: Request,
  { params }: { params: { matchId: string; roundId: string } },
) {
  try {
    const updateData = await request.json();
    const { roundId } = await params;

    // TODO: Check if match exist
    const updateInformations = await updateRoundInformations(
      `Round:${roundId}`,
      updateData,
    );
    return NextResponse.json(updateInformations);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du round" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/protected/matches/{matchId}/rounds/{roundId}
 *
 * Suppréssion d'un round
 * @param matchData
 * @returns
 *
 */
export async function DELETE(
  request: Request,
  { params }: { params: { matchId: string; roundId: string } },
) {
  const { roundId } = await params;

  // TODO: Check if match exist
  const roundInformations = await deleteRound(`Round:${roundId}`);

  return NextResponse.json(roundInformations);
}
