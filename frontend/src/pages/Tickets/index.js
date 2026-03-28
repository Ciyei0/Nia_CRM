import React from "react";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import TicketsManager from "../../components/TicketsManager/";
import Ticket from "../../components/Ticket/";

import logo from "../../assets/logo.png";

import { i18n } from "../../translate/i18n";

const useStyles = makeStyles(theme => ({
	chatContainer: {
		flex: 1,
		padding: theme.spacing(0),
		height: `calc(100% - 64px)`, // Adjusted for taller topbar
		overflowY: "hidden",
        backgroundColor: theme.palette.fancyBackground,
	},

	chatPapper: {
		display: "flex",
		height: "100%",
	},

	contactsWrapper: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
		overflowY: "hidden",
        borderRight: `1px solid ${theme.palette.bordabox}`,
	},
	messagessWrapper: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
        backgroundColor: theme.palette.fancyBackground,
	},
	welcomeMsg: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		textAlign: "center",
        backgroundColor: theme.palette.fancyBackground,
        border: "none",
        position: "relative",
        overflow: "hidden",
        '&::before': {
            content: '""',
            position: "absolute",
            width: "300px",
            height: "300px",
            background: "linear-gradient(135deg, #70008b, #8E24AA)",
            borderRadius: "50%",
            filter: "blur(80px)",
            opacity: 0.1,
            zIndex: 0,
        }
	},
    welcomeContent: {
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    logoIconLarge: {
        width: "350px",
        height: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        marginBottom: theme.spacing(3),
    },
    welcomeTitle: {
        fontSize: "2.5rem",
        fontWeight: 800,
        color: theme.palette.primary.main,
        marginBottom: theme.spacing(1),
    },
    welcomeSubtitle: {
        fontSize: "1.2rem",
        color: theme.palette.secondary.main,
        fontWeight: 500,
    }
}));

const Chat = () => {
	const classes = useStyles();
	const { ticketId } = useParams();

	return (
		<div className={classes.chatContainer}>
			<div className={classes.chatPapper}>
				<Grid container spacing={0}>
					<Grid item xs={4} className={classes.contactsWrapper}>
						<TicketsManager />
					</Grid>
					<Grid item xs={8} className={classes.messagessWrapper}>
						{ticketId ? (
							<>
								<Ticket />
							</>
						) : (
							<Paper square variant="outlined" className={classes.welcomeMsg}>
                                <div className={classes.welcomeContent}>
                                    <div className={classes.logoIconLarge}>
                                        <img src={logo} style={{ width: "100%" }} alt="Nia CRM" />
                                    </div>
                                </div>
							</Paper>
						)}
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default Chat;
