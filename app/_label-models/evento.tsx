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

type LabelEventoProps = {
  date: Date;
  mealType: string;
  printQtd: number;
  dataSector: dataSectorOptions[];
  width: number;
  height: number;
  eventTitle?: string;
  eventDescription?: string;
  eventLocation?: string;
  eventDate?: string;
  eventTime?: string;
};

const LabelEvento = ({
  date,
  mealType,
  dataSector,
  printQtd,
  width,
  height,
  eventTitle,
  eventDescription,
  eventLocation,
  eventDate,
  eventTime,
}: LabelEventoProps) => {
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
        local: eventLocation,
        horario: eventTime,
        titulo: eventTitle,
        descricao: eventDescription,
        dataEvento: eventDate,
      });
      setQrCodeLink(link);
    };

    getLink();
  }, [data, dateFormatted, mealType, eventLocation, eventTime, eventTitle, eventDescription, eventDate]);

  if (!data || !qrCodeLink) return null;

  return (
    <div>
      {Array.from({ length: printQtd }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col w-full h-full border p-1 rounded-2xl"
          style={{
            width: `${width}cm`,
            height: `${height}cm`,
          }}
        >
          <div className="flex flex-col h-full text-[8px] justify-center">
            <div className="justify-center text-center">
              <span className="font-bold text-[10px]">
                AUTORIZAÇÃO DE ACESSO
              </span>
              <div className="flex w-full text-[10px] font-bold justify-center">
                {eventTitle || "ARRAIÁ DOS AMIGOS"}
              </div>
            </div>
            <div className="flex w-full h-full">
              <div className="flex w-full flex-col ml-2">
                <div className="flex flex-col mt-1 text-[10px]">
                  {eventLocation && <div>LOCAL: {eventLocation}</div>}
                  {eventDate && <div>DATA: {eventDate}</div>}
                  {eventTime && <div>HORÁRIO: {eventTime}</div>}
                  {eventDescription && <div>{eventDescription}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LabelEvento;
