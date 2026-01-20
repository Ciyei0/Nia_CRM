import React from "react";

import { Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TicketHeaderSkeleton from "../TicketHeaderSkeleton";

const useStyles = makeStyles(theme => ({
	ticketHeader: {
		display: "flex",
		background: theme.palette.type === 'light'
			? "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
			: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
		flex: "none",
		borderBottom: "none",
		boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
		padding: "8px 16px",
		alignItems: "center",
		minHeight: 64,
		position: "relative",
		zIndex: 10,
		[theme.breakpoints.down("sm")]: {
			flexWrap: "wrap",
			padding: "8px 12px",
		}
	},
}));


const TicketHeader = ({ loading, children }) => {
	const classes = useStyles();

	return (
		<>
			{loading ? (
				<TicketHeaderSkeleton />
			) : (
				<Card square className={classes.ticketHeader}>
					{children}
				</Card>
			)}
		</>
	);
};

export default TicketHeader;
