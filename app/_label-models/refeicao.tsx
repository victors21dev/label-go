import QRCode from "react-qr-code";

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
  printQtd: number;
  dataSector: dataSectorOptions[];
  width: number;
  height: number;
  qr: string;
};

const LabelRefeicao = ({
  dataSector,
  printQtd,
  width,
  height,
  qr,
}: LabelRefeicaoProps) => {
  let data = dataSector[0];
  if (!data) return null;

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
                    value={`https://valida-qr.vercel.app/?data=${qr}`}
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
                      Val.:
                      <span className="font-bold ml-2">06/02/2026</span>
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
