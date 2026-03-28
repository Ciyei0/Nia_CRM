import React from "react";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import TicketsManager from "../../components/TicketsManagerTabs/";
import Ticket from "../../components/Ticket/";
import { i18n } from "../../translate/i18n";
import niaLogo from "../../assets/nia-logo.png";

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
	messagesWrapper: {
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
        width: "120px",
        height: "120px",
        background: "linear-gradient(135deg, #70008b, #8E24AA)",
        borderRadius: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        marginBottom: theme.spacing(3),
        boxShadow: "0 20px 40px rgba(112, 0, 139, 0.2)",
    },
    welcomeTitle: {
        fontSize: "2.5rem",
        fontWeight: 800,
        color: theme.palette.primary.main,
        marginBottom: theme.spacing(1),
        fontFamily: "'Inter', sans-serif",
    },
    welcomeSubtitle: {
        fontSize: "1.2rem",
        color: theme.palette.secondary.main,
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
    }
}));



const TicketsCustom = () => {
	const classes = useStyles();
	const { ticketId } = useParams();

	return (
		<div className={classes.chatContainer}>
			<div className={classes.chatPapper}>
				<Grid container spacing={0}>
					<Grid item xs={4} className={classes.contactsWrapper}>
						<TicketsManager />
					</Grid>
					<Grid item xs={8} className={classes.messagesWrapper}>
						{ticketId ? (
							<>
								<Ticket />
							</>
						) : (
							<Paper disableGutters square variant="outlined" className={classes.welcomeMsg}>
                                <div className={classes.welcomeContent}>
                                    <div className={classes.logoIconLarge}>
                                        <img src={niaLogo} style={{ width: "60%" }} alt="Nia CRM" />
                                    </div>
                                    <Typography className={classes.welcomeTitle}>Nia CRM</Typography>
                                </div>
							</Paper>
						)}
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default TicketsCustom;
