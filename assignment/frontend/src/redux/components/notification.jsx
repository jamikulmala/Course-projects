import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { removeNotification } from "../actionCreators/notificationsActions";

export const NotificationContainer = () => {

    const notification = useSelector((state) => state.notification);
    const dispatch = useDispatch();
        useEffect(() => {
            const timeId = setTimeout(() => {
                dispatch(removeNotification());
              }, 5000);

              return () => {
                clearTimeout(timeId);
              };
            }, [notification]);

    if(notification.message !== ''){
        return (
            <div data-testid="notification-container">
                <span 
                    style={{backgroundColor: notification.isSuccess ? 'green' : 'red'}} data-testid="description-value">
                    {notification.message}
                </span>
            </div>
        );
    } else {
        return (
            <div data-testid="no-notification-container">
                <span data-testid="description-value">
                    {notification.message}
                </span>
            </div>
        );
    }
};