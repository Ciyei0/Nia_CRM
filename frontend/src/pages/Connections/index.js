
import React, { useState, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";

import { makeStyles } from "@material-ui/core/styles";
import { green, red, grey } from "@material-ui/core/colors";
import {
	Button,
	Paper,
	Typography,
	Grid,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Card,
	CardContent,
	Divider,
	IconButton,
	Box
} from "@material-ui/core";
import {
	Edit,
	CheckCircle,
	SignalCellularConnectedNoInternet2Bar,
	SignalCellularConnectedNoInternet0Bar,
	SignalCellular4Bar,
	CropFree,
	DeleteOutline,
	WhatsApp,
	Facebook,
	Instagram,
	Language, // For Web Chat
	MusicNote, // For TikTok (placeholder)
	Add,
	ArrowDropDown,
	InfoOutlined,
	MoreVert
} from "@material-ui/icons";

import formatSerializedId from '../../utils/formatSerializedId';
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import api from "../../services/api";
import WhatsAppModal from "../../components/WhatsAppModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import QrcodeModal from "../../components/QrcodeModal";
import { i18n } from "../../translate/i18n";
import { WhatsAppsContext } from "../../context/WhatsApp/WhatsAppsContext";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../../components/Can";

const useStyles = makeStyles(theme => ({
	mainPaper: {
		flex: 1,
		padding: theme.spacing(2),
		overflowY: "scroll",
		backgroundColor: "#f4f6f8", // Light background for contrast
		...theme.scrollbarStyles,
	},
	card: {
		borderRadius: 12,
		position: 'relative',
		transition: '0.3s',
		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
		},
		overflow: 'visible'
	},
	cardHeader: {
		padding: theme.spacing(2),
		minHeight: 100,
		display: 'flex',
		alignItems: 'center',
		background: 'linear-gradient(90deg, rgba(37, 211, 102, 0.1) 0%, rgba(255,255,255,1) 80%)',
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
		position: 'relative'
	},
	cardIcon: {
		fontSize: 48,
		color: '#25D366', // WhatsApp Green
		marginRight: theme.spacing(2)
	},
	statusPill: {
		display: 'inline-flex',
		alignItems: 'center',
		padding: '4px 12px',
		borderRadius: 20,
		fontSize: '0.75rem',
		fontWeight: 600,
		textTransform: 'uppercase',
		marginTop: theme.spacing(1)
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: '50%',
		marginRight: 6,
	},
	cardFooter: {
		padding: theme.spacing(1, 2),
		backgroundColor: '#f5f5f5',
		borderBottomLeftRadius: 12,
		borderBottomRightRadius: 12,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	actionsContainer: {
		display: 'flex',
		gap: theme.spacing(1)
	},
	addButton: {
		borderRadius: 20,
		backgroundColor: '#2563EB', // Blue
		color: '#fff',
		textTransform: 'none',
		padding: '8px 24px',
		'&:hover': {
			backgroundColor: '#1E40AF',
		}
	},
	menuItemIcon: {
		minWidth: 36
	}
}));

const Connections = () => {
	const classes = useStyles();
	const { user } = useContext(AuthContext);
	const { whatsApps, loading } = useContext(WhatsAppsContext);
	const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
	const [qrModalOpen, setQrModalOpen] = useState(false);
	const [selectedWhatsApp, setSelectedWhatsApp] = useState(null);
	const [confirmModalOpen, setConfirmModalOpen] = useState(false);

	// Menu for Add Connection
	const [anchorEl, setAnchorEl] = useState(null);

	// Menu for Connection Card
	const [cardMenuAnchorEl, setCardMenuAnchorEl] = useState(null);
	const [selectedWhatsAppForMenu, setSelectedWhatsAppForMenu] = useState(null);

	const confirmationModalInitialState = {
		action: "",
		title: "",
		message: "",
		whatsAppId: "",
		open: false,
	};
	const [confirmModalInfo, setConfirmModalInfo] = useState(
		confirmationModalInitialState
	);

	// Listen for Facebook OAuth callback messages from popup
	useEffect(() => {
		const handleFacebookMessage = async (event) => {
			if (event.data?.type === "FB_AUTH_SUCCESS") {
				try {
					toast.info("Creando conexión WhatsApp Cloud...");
					const redirectUri = `${window.location.origin}/fb-callback`;
					const response = await api.post("/whatsapp/facebook", {
						code: event.data.code,
						redirectUri,
						name: "WhatsApp Cloud API"
					});
					toast.success("¡Conexión WhatsApp Cloud creada exitosamente!");
					console.log("WhatsApp Cloud connection created:", response.data);
				} catch (err) {
					console.error("Error creating WhatsApp Cloud connection:", err);
					toastError(err);
				}
			} else if (event.data?.type === "FB_AUTH_ERROR") {
				toast.error(`Error en autorización: ${event.data.error}`);
			}
		};

		window.addEventListener("message", handleFacebookMessage);
		return () => window.removeEventListener("message", handleFacebookMessage);
	}, []);

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleCardMenuOpen = (event, whatsApp) => {
		setCardMenuAnchorEl(event.currentTarget);
		setSelectedWhatsAppForMenu(whatsApp);
	};

	const handleCardMenuClose = () => {
		setCardMenuAnchorEl(null);
		setSelectedWhatsAppForMenu(null);
	};

	const handleOpenWhatsAppModal = () => {
		setSelectedWhatsApp(null);
		handleMenuClose();
		setWhatsAppModalOpen(true);
	};

	const handleCloseWhatsAppModal = useCallback(() => {
		setWhatsAppModalOpen(false);
		setSelectedWhatsApp(null);
	}, [setSelectedWhatsApp, setWhatsAppModalOpen]);

	const handleOpenQrModal = whatsApp => {
		setSelectedWhatsApp(whatsApp);
		setQrModalOpen(true);
	};

	const handleCloseQrModal = useCallback(() => {
		setSelectedWhatsApp(null);
		setQrModalOpen(false);
	}, [setQrModalOpen, setSelectedWhatsApp]);

	const handleEditWhatsApp = whatsApp => {
		setSelectedWhatsApp(whatsApp);
		setWhatsAppModalOpen(true);
		handleCardMenuClose();
	};

	const handleOpenConfirmationModal = (action, whatsAppId) => {
		if (action === "disconnect") {
			setConfirmModalInfo({
				action: action,
				title: i18n.t("connections.confirmationModal.disconnectTitle"),
				message: i18n.t("connections.confirmationModal.disconnectMessage"),
				whatsAppId: whatsAppId,
			});
		}

		if (action === "delete") {
			setConfirmModalInfo({
				action: action,
				title: i18n.t("connections.confirmationModal.deleteTitle"),
				message: i18n.t("connections.confirmationModal.deleteMessage"),
				whatsAppId: whatsAppId,
			});
		}
		setConfirmModalOpen(true);
		handleCardMenuClose();
	};

	const handleSubmitConfirmationModal = async () => {
		if (confirmModalInfo.action === "disconnect") {
			try {
				await api.delete(`/whatsappsession/${confirmModalInfo.whatsAppId}`);
			} catch (err) {
				toastError(err);
			}
		}

		if (confirmModalInfo.action === "delete") {
			try {
				await api.delete(`/whatsapp/${confirmModalInfo.whatsAppId}`);
				toast.success(i18n.t("connections.toasts.deleted"));
			} catch (err) {
				toastError(err);
			}
		}

		setConfirmModalInfo(confirmationModalInitialState);
	};

	const handleRequestNewQrCode = async whatsAppId => {
		try {
			await api.put(`/whatsappsession/${whatsAppId}`);
		} catch (err) {
			toastError(err);
		}
	};

	const handleFacebookLogin = () => {
		handleMenuClose();

		const clientId = process.env.REACT_APP_FACEBOOK_APP_ID;
		const redirectUri = process.env.REACT_APP_FRONTEND_URL || window.location.origin;

		if (!clientId || clientId === 'YOUR_FACEBOOK_APP_ID_HERE') {
			toast.error("Falta configurar REACT_APP_FACEBOOK_APP_ID en el archivo .env");
			return;
		}

		// URL for the popup
		const url = `https://web.facebook.com/v20.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}/fb-callback&response_type=code&scope=whatsapp_business_management,whatsapp_business_messaging`;

		// Open popup
		const width = 600;
		const height = 700;
		const left = (window.screen.width - width) / 2;
		const top = (window.screen.height - height) / 2;

		window.open(url, 'facebook_login', `width=${width},height=${height},top=${top},left=${left}`);
	};

	const renderStatusPill = (status) => {
		let color = grey[500];
		let bg = grey[100];
		let text = "Desconocido";

		switch (status) {
			case "CONNECTED":
				color = green[600];
				bg = green[50];
				text = "Conectada";
				break;
			case "DISCONNECTED":
				color = red[600];
				bg = red[50];
				text = "Desconectada";
				break;
			case "qrcode":
				color = "#d97706"; // Amber
				bg = "#fffbeb";
				text = "Esperando QR";
				break;
			case "PAIRING":
				color = "#2563EB"; // Blue
				bg = "#EFF6FF";
				text = "Emparejando";
				break;
			case "TIMEOUT":
				color = red[600];
				bg = red[50];
				text = "Tiempo Agotado";
				break;
			case "OPENING":
				color = "#2563EB";
				bg = "#EFF6FF";
				text = "Iniciando...";
				break;
			default:
				break;
		}

		return (
			<div className={classes.statusPill} style={{ color: color, backgroundColor: bg, border: `1px solid ${color}40` }}>
				<div className={classes.statusDot} style={{ backgroundColor: color }} />
				{text}
			</div>
		);
	};

	const renderActionText = (whatsApp) => {
		if (whatsApp.status === "qrcode") return "Escanear QR Code";
		if (whatsApp.status === "DISCONNECTED") return "Nuevo QR-Code";
		if (whatsApp.status === "CONNECTED") return "Conexión Establecida";
		return "Gestionar Conexión";
	};

	return (
		<MainContainer className={classes.mainContainer}>
			<ConfirmationModal
				title={confirmModalInfo.title}
				open={confirmModalOpen}
				onClose={setConfirmModalOpen}
				onConfirm={handleSubmitConfirmationModal}
			>
				{confirmModalInfo.message}
			</ConfirmationModal>
			<QrcodeModal
				open={qrModalOpen}
				onClose={handleCloseQrModal}
				whatsAppId={!whatsAppModalOpen && selectedWhatsApp?.id}
			/>
			<WhatsAppModal
				open={whatsAppModalOpen}
				onClose={handleCloseWhatsAppModal}
				whatsAppId={!qrModalOpen && selectedWhatsApp?.id}
			/>
			<MainHeader>
				<Title>{i18n.t("connections.title")}</Title>
				<MainHeaderButtonsWrapper>
					<Can
						role={user.profile}
						perform="connections-page:addConnection"
						yes={() => (
							<>
								<Button
									variant="contained"
									color="primary"
									onClick={handleMenuOpen}
									endIcon={<ArrowDropDown />}
									className={classes.addButton}
								>
									{i18n.t("connections.buttons.add")}
								</Button>
								<Menu
									anchorEl={anchorEl}
									keepMounted
									open={Boolean(anchorEl)}
									onClose={handleMenuClose}
									getContentAnchorEl={null}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'right',
									}}
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
								>
									<MenuItem onClick={handleOpenWhatsAppModal}>
										<ListItemIcon className={classes.menuItemIcon}>
											<WhatsApp style={{ color: '#25D366' }} />
										</ListItemIcon>
										<ListItemText primary="WhatsApp QR Code" />
										<InfoOutlined fontSize="small" style={{ color: grey[400], marginLeft: 10 }} />
									</MenuItem>
									<MenuItem onClick={handleFacebookLogin}>
										<ListItemIcon className={classes.menuItemIcon}>
											<WhatsApp style={{ color: '#25D366' }} />
										</ListItemIcon>
										<ListItemText primary="WhatsApp API Cloud" />
										<InfoOutlined fontSize="small" style={{ color: grey[400], marginLeft: 10 }} />
									</MenuItem>
									<MenuItem onClick={handleFacebookLogin}>
										<ListItemIcon className={classes.menuItemIcon}>
											<WhatsApp style={{ color: '#25D366' }} />
										</ListItemIcon>
										<ListItemText primary="WhatsApp API Coexistencia" />
										<InfoOutlined fontSize="small" style={{ color: grey[400], marginLeft: 10 }} />
									</MenuItem>
									<MenuItem onClick={handleFacebookLogin}>
										<ListItemIcon className={classes.menuItemIcon}>
											<Facebook style={{ color: '#1877F2' }} />
										</ListItemIcon>
										<ListItemText primary="Facebook" />
									</MenuItem>
									<MenuItem onClick={handleFacebookLogin}>
										<ListItemIcon className={classes.menuItemIcon}>
											<Instagram style={{ color: '#E1306C' }} />
										</ListItemIcon>
										<ListItemText primary="Instagram" />
									</MenuItem>
									<MenuItem disabled>
										<ListItemIcon className={classes.menuItemIcon}>
											<MusicNote style={{ color: '#000000' }} />
										</ListItemIcon>
										<ListItemText primary="TikTok" />
									</MenuItem>
									<MenuItem disabled>
										<ListItemIcon className={classes.menuItemIcon}>
											<Language style={{ color: '#2563EB' }} />
										</ListItemIcon>
										<ListItemText primary="Web Chat" />
									</MenuItem>
								</Menu>
							</>
						)}
					/>
				</MainHeaderButtonsWrapper>
			</MainHeader>

			<Paper className={classes.mainPaper} variant="outlined" style={{ border: 'none', background: 'transparent' }}>
				<Grid container spacing={3}>
					{whatsApps?.length > 0 ? whatsApps.map(whatsApp => (
						<Grid item xs={12} sm={6} md={4} key={whatsApp.id}>
							<Card className={classes.card}>
								<div className={classes.cardHeader}>
									<WhatsApp className={classes.cardIcon} />
									<div style={{ flex: 1 }}>
										<Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '1rem' }}>
											{whatsApp.name}
										</Typography>
										{renderStatusPill(whatsApp.status)}
									</div>
									<IconButton size="small" onClick={(e) => handleCardMenuOpen(e, whatsApp)}>
										<MoreVert />
									</IconButton>
								</div>
								<div className={classes.cardFooter}>
									<Typography variant="body2" color="textSecondary" style={{ fontWeight: 500 }}>
										{renderActionText(whatsApp)}
									</Typography>
									<div className={classes.actionsContainer}>
										{whatsApp.status === "qrcode" && (
											<Button size="small" variant="contained" color="primary" onClick={() => handleOpenQrModal(whatsApp)}>
												Mostrar QR
											</Button>
										)}
										{whatsApp.status === "DISCONNECTED" && (
											<Button size="small" variant="text" color="primary" onClick={() => handleRequestNewQrCode(whatsApp.id)}>
												Reconectar
											</Button>
										)}
										{(whatsApp.status === "CONNECTED" || whatsApp.status === "PAIRING" || whatsApp.status === "TIMEOUT") && (
											<IconButton size="small" color="secondary" onClick={() => handleOpenConfirmationModal("disconnect", whatsApp.id)}>
												<DeleteOutline />
											</IconButton>
										)}
									</div>
								</div>
							</Card>
						</Grid>
					)) : (
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: 40, opacity: 0.6 }}>
							<SignalCellularConnectedNoInternet0Bar style={{ fontSize: 60, color: grey[400] }} />
							<Typography variant="h6" color="textSecondary" style={{ marginTop: 10 }}>
								Sin conexiones activas
							</Typography>
						</div>
					)}
				</Grid>
			</Paper>

			{/* Card Options Menu */}
			<Menu
				anchorEl={cardMenuAnchorEl}
				keepMounted
				open={Boolean(cardMenuAnchorEl)}
				onClose={handleCardMenuClose}
			>
				<MenuItem onClick={() => handleEditWhatsApp(selectedWhatsAppForMenu)}>
					<ListItemIcon>
						<Edit fontSize="small" />
					</ListItemIcon>
					<ListItemText primary={i18n.t("connections.buttons.edit")} />
				</MenuItem>
				<MenuItem onClick={() => handleOpenConfirmationModal("delete", selectedWhatsAppForMenu?.id)}>
					<ListItemIcon>
						<DeleteOutline fontSize="small" />
					</ListItemIcon>
					<ListItemText primary={i18n.t("connections.buttons.delete")} />
				</MenuItem>
			</Menu>
		</MainContainer>
	);
};

export default Connections;