import { ProcessingStatus } from "../../shared/common-utils";

const ProcessingStatusComponent: React.FC<{ status: ProcessingStatus }> = ({
  status,
}) => {
  const getStatusStyle = () => {
    switch (status) {
      case ProcessingStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case ProcessingStatus.FINISHED:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle()}`}
    >
      {status}
    </span>
  );
};
export default ProcessingStatusComponent;
