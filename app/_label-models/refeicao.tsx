"use client";

import QRCode from "react-qr-code";
import { handleGenerateLink } from "@/app/_actions/generate-link";
import { useEffect, useState } from "react";
import { format } from "date-fns";

type dataSectorOptions = {
  id: string | number;
  name: string;
  coordinatorName: string;
};

type OptionsQrDetails = {
  setor: string;
  coordenador: string;
  validade: string;
  tipo: string;
};

type LabelRefeicaoProps = {
  date: Date;
  mealType: string;
  printQtd: number;
  dataSector: dataSectorOptions[];
  width: number;
  height: number;
};

const LabelRefeicao = ({
  date,
  mealType,
  dataSector,
  printQtd,
  width,
  height,
}: LabelRefeicaoProps) => {
  const [qrCodeLink, setQrCodeLink] = useState("");
  const data = dataSector[0];
  const dateFormatted = format(date, "dd/MM/yyyy");

  useEffect(() => {
    if (!data) return;

    const getLink = async () => {
      const link = await handleGenerateLink({
        setor: data.name,
        coordenador: data.coordinatorName,
        validade: dateFormatted,
        tipo: mealType,
      });
      setQrCodeLink(link);
    };

    getLink();
  }, [data, dateFormatted, mealType]);

  if (!data || !qrCodeLink) return null;
  console.log(mealType);

  return (
    <div>
      {Array.from({ length: printQtd }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col w-full h-full border p-2 rounded-2xl"
          style={{
            width: `${width}cm`,
            height: `${height}cm`,
          }}
        >
          <div className="flex flex-col h-full text-[10px] justify-center">
            <div className="justify-center text-center">
              AUTORIZAÇÃO DE <span className="font-bold">REFEIÇÃO</span>
              {/* Linha */}
              <div
                className="flex items-center justify-between w-full"
                style={{
                  border: "none",
                  borderTop: "2px dotted #333",
                  height: "0",
                }}
              ></div>
            </div>
            <div className="flex w-full h-full">
              <div className="w-fit">
                <div className="flex items-center h-full">
                  <QRCode
                    size={60}
                    value={`https://valida-qr.vercel.app/?data=${qrCodeLink}`}
                  />
                </div>
              </div>
              <div className="flex flex-col ml-2">
                <div className="flex flex-col mt-1">
                  <div>
                    Setor:
                    <span className="font-bold ml-2">{data.name}</span>
                  </div>
                  <div>
                    Coord.:
                    <span className="font-bold ml-2">
                      {data.coordinatorName}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="relative h-full">
                    <div className="flex flex-col h-full justify-center">
                      <div>
                        Val.:{" "}
                        <span className="font-bold ml-2">{dateFormatted}</span>
                      </div>
                      <div>
                        Tipo: {""}
                        <span className="font-bold ml-2">{mealType}</span>
                      </div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LabelRefeicao;
