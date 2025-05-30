import { Button } from "../ui/button";

const HanldeLogout = (props) => {
  const { handleRemove, setShowConfirmModal, text, confirmation } = props;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4 ">confirmation</h2>
          <p className="mb-4">
            {confirmation
              ? confirmation
              : "Are you sure you want to delete this data?"}{" "}
          </p>
          <div className="flex justify-end space-x-4">
            <Button
              onClick={setShowConfirmModal}
              className="cursor-pointer bg-gray-300 rounded hover:bg-gray-400"
              variant="default"
            >
              Cancel
            </Button>

            <Button
              onClick={handleRemove}
              className="cursor-pointer text-white rounded hover:bg-red-600"
              variant="destructive"
            >
              {text ? text : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HanldeLogout;
