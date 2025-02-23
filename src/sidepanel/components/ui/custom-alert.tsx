import React from "react";
import CustomModal from "./custom-modal";
import { AlertOctagon } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: VoidFunction;
  data: {
    type: "warning";
    title: string;
    description?: string | React.ReactElement;
  };
}

const CustomAlert = ({ isOpen, onClose, data }: Props) => {
  return (
    <CustomModal isOpen={isOpen} onOpenChange={onClose}>
      <div className="text-center space-y-4">
        {data?.type === "warning" && (
          <AlertOctagon size={120} className="mx-auto" />
        )}

        <h1 className="font-extrabold text-2xl">{data?.title}</h1>
        <div className="font-light">{data?.description}</div>
      </div>
    </CustomModal>
  );
};

export default CustomAlert;
