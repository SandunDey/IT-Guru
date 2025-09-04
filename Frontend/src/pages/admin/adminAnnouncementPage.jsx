import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEdit, FaRegPlusSquare, FaTrashAlt } from "react-icons/fa";
import { IoClose, IoTrashOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { Loder } from "../../components/loder";
import { TbReportAnalytics } from "react-icons/tb";

function AnnouncementDeleteConfirm(props) {
  const announcementID = props.announcementID;
  const close = props.close;
  const refresh = props.refresh;

  function deleteAnnouncement() {
    const token = localStorage.getItem("token");

    axios
      .delete(
        import.meta.env.VITE_API_BASE_URL +
          "/api/announcements/" +
          announcementID,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        close();
        toast.success("Announcement Delete Successfully");
        refresh();
      })
      .catch(() => {
        toast.error("Failed to Delete Announcement");
      });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex justify-center items-center px-4">
      <div className="bg-primary rounded-2xl shadow-xl w-full max-w-md relative p-6">
        {/* Close button (top-right) */}
        <button
          onClick={close}
          className="absolute top-[-42px] right-[-42px] w-[40px] h-[40px] bg-white hover:bg-red-500 rounded-full flex justify-center items-center"
        >
          <IoClose className="text-gray-700 text-lg" />
        </button>

        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <FaTrashAlt className="text-2xl" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-2 text-gray-800">
          Delete Announcement
        </h2>

        {/* Description */}
        <p className="text-center text-gray-600 mb-6">
          Are you sure you want to delete Announcement {""}
          <span className="font-bold">{announcementID}</span>? This action
          cannot be undone.
        </p>

        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={close}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={deleteAnnouncement}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminAnnouncementPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [selectedAnnouncementID, setSelectedAnnouncementID] = useState(null); //delete karann ona product id ek
  const [isLoading, setIsLoading] = useState(true); //patam ganiddi loading vevi thiyenne e nisa true

  const navigate = useNavigate();

  useEffect(() => {
    //mek run venne page ek mul vathavt load venkot vitrayi

    if (isLoading) {
      //loading vemin thiyenvanm vitrak me ek parak run karann kiyanva
      axios
        .get(import.meta.env.VITE_API_BASE_URL + "/api/announcements")
        .then((response) => {
          console.log(response.data);
          setAnnouncements(response.data);
          setIsLoading(false); //methan me anvashsha vidiyt 2parak run venva e nisa uda if ek danva
        });
    }
  }, [isLoading]); //array ekt dann puluvam climary variable vitryi, numbers, string, boolean anith evat weda karanne na
  //isLoading ek haddissiye hari venas vunoth me function ek aye run venva

  return (
    <div className="w-full h-full p-6 bg-primary">
      {
        isDeleteConfirmVisible && ( //&& this is not and this is if  mek trueb nisa ithuru tika pennann
          <AnnouncementDeleteConfirm
            refresh={() => {
              setIsLoading(true);
            }}
            announcementID={selectedAnnouncementID}
            close={() => {
              setIsDeleteConfirmVisible(false);
            }}
          />
        ) //isDEleteConfirm visiblenm vitharayi productConfirm ek vetenne0 return selected productID
      }

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-accent">
          Announcement Management
        </h1>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard/add-announcements"
            className="flex items-center bg-blue-950 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-boardercolor transition-colors"
          >
            <FaRegPlusSquare className="text-xl mr-2" />
            Add Announcement
          </Link>

          {/* Report Button */}
          <Link
            to="/admin/dashboard/announcement-report"
            className="flex items-center bg-blue-950 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-boardercolor transition-colors"
          >
            <TbReportAnalytics className="text-xl" />{" "}
            {/* replace icon if needed */}
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-lg border border-boardercolor">
        {isLoading ? (
          <Loder /> //isLoading nam (?) pargraph ek pennann nathnm(:) table ek
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-accent text-white font-bold">
              <tr>
                <th className="py-3 px-4 text-sm font-medium">
                  Announcement ID
                </th>
                <th className="py-3 px-4 text-sm font-medium">Title</th>
                <th className="py-3 px-4 text-sm font-medium">Type</th>
                <th className="py-3 px-4 text-sm font-medium">Audiance</th>
                <th className="py-3 px-4 text-sm font-medium">Expiry Date</th>
                <th className="py-3 px-4 text-sm font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-boardercolor bg-white">
              {announcements.map((item) => (
                <tr
                  key={item.announcementID}
                  className="hover:bg-primary transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-secondary">
                    {item.announcementID}
                  </td>
                  <td className="py-3 px-4">{item.title}</td>
                  <td className="py-3 px-4">{item.type}</td>
                  <td className="py-3 px-4">{item.audience.join(", ")}</td>
                  <td className="py-3 px-4">
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-row gap-4 justify-center items-center">
                      <FaRegEdit
                        className="cursor-pointer hover:text-accent hover:scale-110 transition-transform"
                        title="Edit"
                        aria-label="Edit Announcement"
                        onClick={() => {
                          navigate("/admin/dashboard/update-announcements", {
                            // state kiyannenjson ekk update karankot e adal product tike details yavann state json ekk danva
                            state: item,
                          });
                        }}
                      />
                      <IoTrashOutline
                        className="cursor-pointer hover:text-red-500 hover:scale-110 transition-transform"
                        title="Delete"
                        aria-label="Delete Announcement"
                        onClick={() => {
                          setSelectedAnnouncementID(item.announcementID);
                          setIsDeleteConfirmVisible(true);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
