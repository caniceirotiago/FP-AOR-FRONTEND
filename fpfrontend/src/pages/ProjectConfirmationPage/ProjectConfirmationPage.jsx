import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import userService from "../../services/userService";
import DialogModalStore from "../../stores/useDialogModalStore";

const ProjectConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } =
    DialogModalStore();
  const intl = useIntl();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const approve = searchParams.get("approve");
    const approver = searchParams.get("approver");

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

    performConfirmation();
  }, [navigate, location.search, intl]);

  return (
    <div className="confirmationPage">
      <div></div>
    </div>
  );
};

export default ProjectConfirmationPage;
