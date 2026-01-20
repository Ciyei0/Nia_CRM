import React, { useState, useEffect } from "react";

import { Avatar, CardHeader } from "@material-ui/core";
import { getInitials } from "../../helpers/getInitials";
import { generateColor } from "../../helpers/colorGenerator";
import { i18n } from "../../translate/i18n";

const TicketInfo = ({ contact, ticket, onClick }) => {
	const { user } = ticket
	const [userName, setUserName] = useState('')
	const [contactName, setContactName] = useState('')

	useEffect(() => {
		if (contact) {
			setContactName(contact.name);
			if (document.body.offsetWidth < 600) {
				if (contact.name.length > 10) {
					const truncadName = contact.name.substring(0, 10) + '...';
					setContactName(truncadName);
				}
			}
		}

		if (user && contact) {
			setUserName(`${i18n.t("messagesList.header.assignedTo")} ${user.name}`);

			if (document.body.offsetWidth < 600) {
				setUserName(`${user.name}`);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<CardHeader
			onClick={onClick}
			style={{
				cursor: "pointer",
				padding: "8px 12px",
			}}
			titleTypographyProps={{
				noWrap: true,
				style: {
					fontWeight: 600,
					fontSize: "1rem",
					background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
				}
			}}
			subheaderTypographyProps={{
				noWrap: true,
				style: {
					fontSize: "0.8rem",
					color: "#6b7280",
					marginTop: 2,
				}
			}}
			avatar={
				<Avatar
					style={{
						background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
						color: "white",
						fontWeight: "bold",
						width: 44,
						height: 44,
						fontSize: "1rem",
						boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
					}}
					src={contact.profilePicUrl}
					alt="contact_image">
					{getInitials(contact?.name)}
				</Avatar>
			}
			title={`${contactName} #${ticket.id}`}
			subheader={ticket.user && `${userName}`}
		/>
	);
};

export default TicketInfo;
