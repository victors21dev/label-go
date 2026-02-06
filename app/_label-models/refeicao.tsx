import QRCode from "react-qr-code";

const LabelRefeicao = () => {
  return (
    <div className="flex flex-col w-full h-full gap-4">
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
              <QRCode size={60} value="hey" />
            </div>
          </div>
          <div className="relative">
            <div className="relative h-full">
              <div className="flex flex-col h-full justify-center">
                <div>
                  Setor:
                  <span className="font-bold ml-2">T.I.</span>
                </div>
                <div>
                  Coord.:
                  <span className="font-bold ml-2">Alan Lira</span>
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
        {/* <div>Imp.: Brother - QL-800</div> */}
      </div>
    </div>
  );
};

export default LabelRefeicao;
