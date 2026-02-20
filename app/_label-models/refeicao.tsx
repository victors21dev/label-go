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
  printQtd: number;
  dataSector: dataSectorOptions[];
  width: number;
  height: number;
};

const LabelRefeicao = ({
  date,
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
        validade: dateFormatted, // Passa a data correta para o QR Code
        tipo: "Almoço",
      });
      setQrCodeLink(link);
    };
    getLink();
  }, [data, dateFormatted]);

  if (!data || !qrCodeLink) return null;

  return (
    <div>
      {Array.from({ length: printQtd }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col w-full h-full gap-4 border p-2 rounded-2xl"
          style={{
            width: `${width}cm`,
            height: `${height}cm`,
          }}
        >
          <div className="flex flex-col h-full">
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
            <div className="grid grid-cols-[auto_1fr] gap-2 h-full">
              <div className="w-fit">
                <div className="flex items-center h-full">
                  <QRCode
                    size={60}
                    value={`https://valida-qr.vercel.app/?data=${qrCodeLink}`}
                  />
                </div>
              </div>
              <div className="relative">
                <div className="relative h-full">
                  <div className="flex flex-col h-full justify-center">
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
                    <div>
                      Val.:{" "}
                      <span className="font-bold ml-2">{dateFormatted}</span>
                    </div>
                    <div>
                      Tipo:
                      <span className="font-bold ml-2">Almoço</span>
                    </div>
                    <div></div>
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
