import { NextResponse } from "next/server";
import {
  createFilledRound,
  relateRoundToMatch,
} from "@/app/backend/surreal-actions";
import type { Round } from "@/types/round";

export async function POST(
  request: Request,
  { params }: { params: { matchId: string } },
) {
  try {
    const { matchId } = await params;
    const requestData = await request.json();

    //console.log(requestData, matchid); // DEBUG
    if (!requestData.round_index) {
      return NextResponse.json(
        { error: "Un round doit avoir un index" },
        { status: 400 },
      );
    }

    const createdAt = requestData.created_at
      ? new Date(requestData.created_at)
      : new Date();

    const newRoundData: Round = {
      created_at: createdAt,
      status: "completed",
      round_index: requestData.round_index,
      winner: requestData.winner || undefined,
      // Inclure d'autres propriétés si nécessaire, en excluant created_at et round_index
    };

    const playerDecks = {
      ...Object.fromEntries(
        Object.entries(requestData).filter(
          ([key]) => key !== "created_at" && key !== "round_index",
        ),
      ),
    };

    const roundCreationData = await createFilledRound(
      newRoundData,
      playerDecks,
    );

    await relateRoundToMatch(
      `${roundCreationData.id.tb}:${roundCreationData.id.id}`,
      `Match:${matchId}`,
    );

    return NextResponse.json(roundCreationData, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création du round" },
      { status: 500 },
    );
  }
}
