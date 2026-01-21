import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles, createTheme, ThemeProvider, withStyles } from "@material-ui/core/styles";
import { IconButton, Switch, Box, Typography } from "@material-ui/core";
import { MoreVert, Replay, ContactPhone } from "@material-ui/icons";
import SmartToyIcon from "@material-ui/icons/Android";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import TicketOptionsMenu from "../TicketOptionsMenu";
import ButtonWithSpinner from "../ButtonWithSpinner";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import { TicketsContext } from "../../context/Tickets/TicketsContext";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import UndoRoundedIcon from '@material-ui/icons/UndoRounded';
import Tooltip from '@material-ui/core/Tooltip';
import { green, grey } from '@material-ui/core/colors';

// Custom styled switch for bot toggle
const BotSwitch = withStyles((theme) => ({
	root: {
		width: 52,
		height: 28,
		padding: 0,
		margin: theme.spacing(0, 1),
	},
	switchBase: {
		padding: 2,
		'&$checked': {
			transform: 'translateX(24px)',
			color: theme.palette.common.white,
			'& + $track': {
				backgroundColor: '#4caf50',
				opacity: 1,
				border: 'none',
			},
			'& $thumb': {
				backgroundColor: '#fff',
			},
		},
		'&$focusVisible $thumb': {
			color: '#4caf50',
			border: '6px solid #fff',
		},
	},
	thumb: {
		width: 24,
		height: 24,
		boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
	},
	track: {
		borderRadius: 28 / 2,
		backgroundColor: grey[400],
		opacity: 1,
		transition: theme.transitions.create(['background-color', 'border']),
	},
	checked: {},
	focusVisible: {},
}))(({ classes, ...props }) => {
	return (
		<Switch
			focusVisibleClassName={classes.focusVisible}
			disableRipple
			classes={{
				root: classes.root,
				switchBase: classes.switchBase,
				thumb: classes.thumb,
				track: classes.track,
				checked: classes.checked,
			}}
			{...props}
		/>
	);
});

const useStyles = makeStyles(theme => ({
	actionButtons: {
		marginRight: 6,
		flex: "none",
		alignSelf: "center",
		marginLeft: "auto",
		display: "flex",
		alignItems: "center",
		"& > *": {
			margin: theme.spacing(0.5),
		},
	},
	botToggleContainer: {
		display: "flex",
		alignItems: "center",
		backgroundColor: props => props.isBot ? "rgba(76, 175, 80, 0.1)" : "rgba(158, 158, 158, 0.1)",
		borderRadius: 20,
		padding: "4px 12px 4px 8px",
		marginRight: 8,
		transition: "all 0.3s ease",
		border: props => props.isBot ? "1px solid rgba(76, 175, 80, 0.3)" : "1px solid rgba(158, 158, 158, 0.3)",
	},
	botIcon: {
		fontSize: 20,
		marginRight: 4,
		color: props => props.isBot ? green[500] : grey[500],
		transition: "color 0.3s ease",
	},
	botLabel: {
		fontSize: "0.75rem",
		fontWeight: 600,
		color: props => props.isBot ? green[700] : grey[600],
		marginRight: 4,
		transition: "color 0.3s ease",
		whiteSpace: "nowrap",
	},
}));

const TicketActionButtonsCustom = ({ ticket, onDrawerOpen }) => {
	const classes = useStyles({ isBot: ticket.isBot });
	const history = useHistory();
	const [anchorEl, setAnchorEl] = useState(null);
	const [loading, setLoading] = useState(false);
	const ticketOptionsMenuOpen = Boolean(anchorEl);
	const { user } = useContext(AuthContext);
	const { setCurrentTicket } = useContext(TicketsContext);

	const customTheme = createTheme({
		palette: {
			primary: green,
		}
	});

	const handleOpenTicketOptionsMenu = e => {
		setAnchorEl(e.currentTarget);
	};

	const handleCloseTicketOptionsMenu = e => {
		setAnchorEl(null);
	};

	const handleUpdateTicketStatus = async (e, status, userId) => {
		setLoading(true);
		try {
			await api.put(`/tickets/${ticket.id}`, {
				status: status,
				userId: userId || null,
				useIntegration: status === "closed" ? false : ticket.useIntegration,
				promptId: status === "closed" ? false : ticket.promptId,
				integrationId: status === "closed" ? false : ticket.integrationId
			});

			setLoading(false);
			if (status === "open") {
				setCurrentTicket({ ...ticket, code: "#open" });
			} else {
				setCurrentTicket({ id: null, code: null })
				history.push("/tickets");
			}
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
	};

	const handleToggleBot = async () => {
		setLoading(true);
		try {
			const newIsBot = !ticket.isBot;
			await api.put(`/tickets/${ticket.id}`, {
				isBot: newIsBot
			});
			// Update the ticket in context to reflect the change
			setCurrentTicket({ ...ticket, isBot: newIsBot, code: "#open" });
			setLoading(false);
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
	};

	return (
		<div className={classes.actionButtons}>
			{ticket.status === "closed" && (
				<ButtonWithSpinner
					loading={loading}
					startIcon={<Replay />}
					size="small"
					onClick={e => handleUpdateTicketStatus(e, "open", user?.id)}
				>
					{i18n.t("messagesList.header.buttons.reopen")}
				</ButtonWithSpinner>
			)}
			{ticket.status === "open" && (
				<>
					{/* Bot Toggle Switch */}
					<Tooltip title={ticket.isBot ? "Bot activo - Click para desactivar" : "Bot inactivo - Click para activar"}>
						<Box className={classes.botToggleContainer}>
							<SmartToyIcon className={classes.botIcon} />
							<Typography className={classes.botLabel}>
								{ticket.isBot ? "BOT" : "BOT"}
							</Typography>
							<BotSwitch
								checked={ticket.isBot}
								onChange={handleToggleBot}
								disabled={loading}
							/>
						</Box>
					</Tooltip>

					<Tooltip title={i18n.t("messagesList.header.buttons.return")}>
						<IconButton onClick={e => handleUpdateTicketStatus(e, "pending", null)}>
							<UndoRoundedIcon />
						</IconButton>
					</Tooltip>
					<ThemeProvider theme={customTheme}>
						<Tooltip title={i18n.t("messagesList.header.buttons.resolve")}>
							<IconButton onClick={e => handleUpdateTicketStatus(e, "closed", user?.id)} color="primary">
								<CheckCircleIcon />
							</IconButton>
						</Tooltip>
					</ThemeProvider>

					<Tooltip title="Datos de contacto">
						<IconButton onClick={onDrawerOpen}>
							<ContactPhone />
						</IconButton>
					</Tooltip>

					<IconButton onClick={handleOpenTicketOptionsMenu}>
						<MoreVert />
					</IconButton>
					<TicketOptionsMenu
						ticket={ticket}
						anchorEl={anchorEl}
						menuOpen={ticketOptionsMenuOpen}
						handleClose={handleCloseTicketOptionsMenu}
					/>
				</>
			)}
			{ticket.status === "pending" && (
				<ButtonWithSpinner
					loading={loading}
					size="small"
					variant="contained"
					color="primary"
					onClick={e => handleUpdateTicketStatus(e, "open", user?.id)}
				>
					{i18n.t("messagesList.header.buttons.accept")}
				</ButtonWithSpinner>
			)}
		</div>
	);
};

export default TicketActionButtonsCustom;
