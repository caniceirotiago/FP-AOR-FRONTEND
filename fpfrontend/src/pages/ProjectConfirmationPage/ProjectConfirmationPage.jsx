import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import userService from "../../services/userService";
import DialogModalStore from "../../stores/useDialogModalStore";

const ProjectConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Destructure dialog modal store actions
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } =
    DialogModalStore();
  // Internationalization hook for language translation
  const intl = useIntl();

  useEffect(() => {
    // Parse query parameters from the URL
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const approve = searchParams.get("approve");
    const approver = searchParams.get("approver");
    // If token is missing, show error message and navigate to home
    if (!token) {
      setDialogMessage(
        intl.formatMessage({
          id: "errorTokenNotReceived",
          defaultMessage: "Error Confirming Account! Token not received!",
        })
      );
      setIsDialogOpen(true);
      setAlertType(true);
      setOnConfirm(async () => {
        navigate("/");
      });
      navigate("/");
      return;
    }
    // Function to perform project association confirmation
    const performConfirmation = async () => {
      try {
        const response = await userService.confirmProjectAssociation(
          token,
          approve,
          approver
        );
        if (response.status === 204) {
          setDialogMessage(
            intl.formatMessage({
              id: "requestProcessed",
              defaultMessage: "Request processed!",
            })
          );
          setIsDialogOpen(true);
          setAlertType(true);
          setOnConfirm(async () => {
            navigate("/");
          });
        } else {
          setDialogMessage(
            intl.formatMessage({
              id: "errorAssociatingUser",
              defaultMessage:
                "Error associating user to project or request already processed!",
            })
          );
          setIsDialogOpen(true);
          setAlertType(true);
          setOnConfirm(async () => {
            navigate("/");
          });
        }
      } catch (error) {
        setDialogMessage(
          intl.formatMessage({
            id: "errorAssociatingUserDetailed",
            defaultMessage: "Error associating user to project! {error}",
            values: { error: error.message },
          })
        );
        setIsDialogOpen(true);
        setAlertType(true);
        setOnConfirm(async () => {
          navigate("/");
        });
      }
    };
    // Call the confirmation function on component mount
    performConfirmation();
  }, [navigate, location.search, intl]);

  return (
    <div className="confirmationPage">
      <div></div>
    </div>
  );
};

export default ProjectConfirmationPage;
