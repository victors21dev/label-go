import QRCode from "react-qr-code";

const LabelModel = () => {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-[auto_1fr] gap-1 h-full">
          <div className="w-fit">
            <div className="flex items-center h-full">
              <QRCode size={80} value="hey" />
            </div>
          </div>
          <div className="relative">
            {/* Linha */}
            {/* <div
              className="flex items-center justify-between w-full"
              style={{
                border: "none",
                borderTop: "2px dotted #333",
                height: "0",
              }}
            ></div> */}
            <div className="relative">
              <div className="font-bold justify-center text-center">
                REFEIÇÃO
              </div>
              <div className="flex flex-col h-full justify-center">
                <div>Setor: </div>
                <div>Coord.: </div>
                <div>Val.: </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <div>Imp.: </div>
      </div>
    </div>
  );
};

export default LabelModel;
