import React, { useState, useEffect, useContext, useRef } from "react";
import "emoji-mart/css/emoji-mart.css";
import { useParams } from "react-router-dom";
import { Picker } from "emoji-mart";
import MicRecorder from "mic-recorder-to-mp3";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import IconButton from "@material-ui/core/IconButton";
import MoodIcon from "@material-ui/icons/Mood";
import SendIcon from "@material-ui/icons/Send";
import CancelIcon from "@material-ui/icons/Cancel";
import ClearIcon from "@material-ui/icons/Clear";
import MicIcon from "@material-ui/icons/Mic";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { FormControlLabel, Switch } from "@material-ui/core";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import RecordingTimer from "./RecordingTimer";
import { ReplyMessageContext } from "../../context/ReplyingMessage/ReplyingMessageContext";
import { AuthContext } from "../../context/Auth/AuthContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import toastError from "../../errors/toastError";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const useStyles = makeStyles(theme => ({
	mainWrapper: {
		background: theme.palette.type === 'light'
			? "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
			: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		borderTop: "none",
		boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.08)",
	},

	newMessageBox: {
		background: "transparent",
		width: "100%",
		display: "flex",
		padding: "12px 16px",
		alignItems: "center",
		gap: 8,
	},

	messageInputWrapper: {
		padding: "8px 16px",
		marginRight: 0,
		background: theme.palette.type === 'light'
			? "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
			: "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)",
		display: "flex",
		borderRadius: 25,
		flex: 1,
		boxShadow: theme.palette.type === 'light'
			? "0 2px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)"
			: "0 2px 12px rgba(0, 0, 0, 0.3)",
		border: theme.palette.type === 'light'
			? "1px solid rgba(102, 126, 234, 0.15)"
			: "1px solid rgba(255,255,255,0.08)",
		transition: "all 0.3s ease",
		"&:focus-within": {
			boxShadow: "0 4px 20px rgba(102, 126, 234, 0.25)",
			border: "1px solid rgba(102, 126, 234, 0.4)",
		},
	},

	messageInput: {
		paddingLeft: 8,
		flex: 1,
		border: "none",
		fontSize: "0.95rem",
		color: theme.palette.type === 'light' ? "#2d3748" : "#e2e8f0",
		"&::placeholder": {
			color: theme.palette.type === 'light' ? "#9ca3af" : "#6b7280",
		},
	},

	sendMessageIcons: {
		color: "#667eea",
		transition: "all 0.2s ease",
		"&:hover": {
			color: "#764ba2",
		},
	},

	uploadInput: {
		display: "none",
	},

	viewMediaInputWrapper: {
		display: "flex",
		padding: "12px 16px",
		position: "relative",
		justifyContent: "space-between",
		alignItems: "center",
		background: theme.palette.type === 'light'
			? "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
			: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
		borderTop: "none",
		boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.08)",
	},

	emojiBox: {
		position: "absolute",
		bottom: 70,
		width: 40,
		borderRadius: "16px",
		overflow: "hidden",
		boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
		zIndex: 100,
	},

	circleLoading: {
		color: "#667eea",
		opacity: "85%",
		position: "absolute",
		top: "20%",
		left: "50%",
		marginLeft: -12,
	},

	audioLoading: {
		color: "#667eea",
		opacity: "85%",
	},

	recorderWrapper: {
		display: "flex",
		alignItems: "center",
		alignContent: "middle",
		gap: 8,
		padding: "4px 12px",
		background: "rgba(239, 68, 68, 0.1)",
		borderRadius: 20,
	},

	cancelAudioIcon: {
		color: "#ef4444",
		transition: "all 0.2s ease",
		"&:hover": {
			color: "#dc2626",
		},
	},

	sendAudioIcon: {
		color: "#10b981",
		transition: "all 0.2s ease",
		"&:hover": {
			color: "#059669",
		},
	},

	replyginMsgWrapper: {
		display: "flex",
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 12,
		paddingLeft: 16,
		paddingRight: 16,
	},

	replyginMsgContainer: {
		flex: 1,
		marginRight: 8,
		overflowY: "hidden",
		background: theme.palette.type === 'light'
			? "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
			: "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)",
		borderRadius: "12px",
		display: "flex",
		position: "relative",
		border: "1px solid rgba(102, 126, 234, 0.2)",
	},

	replyginMsgBody: {
		padding: 12,
		height: "auto",
		display: "block",
		whiteSpace: "pre-wrap",
		overflow: "hidden",
		fontSize: "0.9rem",
		color: theme.palette.type === 'light' ? "#4b5563" : "#d1d5db",
	},

	replyginContactMsgSideColor: {
		flex: "none",
		width: "4px",
		background: "linear-gradient(180deg, #10b981 0%, #059669 100%)",
		borderRadius: "4px 0 0 4px",
	},

	replyginSelfMsgSideColor: {
		flex: "none",
		width: "4px",
		background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
		borderRadius: "4px 0 0 4px",
	},

	messageContactName: {
		display: "flex",
		background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		fontWeight: 600,
		fontSize: "0.85rem",
		marginBottom: 4,
	},
}));

const MessageInput = ({ ticketStatus }) => {
	const classes = useStyles();
	const { ticketId } = useParams();

	const [medias, setMedias] = useState([]);
	const [inputMessage, setInputMessage] = useState("");
	const [showEmoji, setShowEmoji] = useState(false);
	const [loading, setLoading] = useState(false);
	const [recording, setRecording] = useState(false);
	const inputRef = useRef();
	const { setReplyingMessage, replyingMessage } = useContext(
		ReplyMessageContext
	);
	const { user } = useContext(AuthContext);

	const [signMessage, setSignMessage] = useLocalStorage("signOption", true);

	useEffect(() => {
		inputRef.current.focus();
	}, [replyingMessage]);

	useEffect(() => {
		inputRef.current.focus();
		return () => {
			setInputMessage("");
			setShowEmoji(false);
			setMedias([]);
			setReplyingMessage(null);
		};
	}, [ticketId, setReplyingMessage]);

	const handleChangeInput = e => {
		setInputMessage(e.target.value);
	};

	const handleAddEmoji = e => {
		let emoji = e.native;
		setInputMessage(prevState => prevState + emoji);
	};

	const handleChangeMedias = e => {
		if (!e.target.files) {
			return;
		}

		const selectedMedias = Array.from(e.target.files);
		setMedias(selectedMedias);
	};

	const handleInputPaste = e => {
		if (e.clipboardData.files[0]) {
			setMedias([e.clipboardData.files[0]]);
		}
	};

	const handleUploadMedia = async e => {
		setLoading(true);
		e.preventDefault();

		const formData = new FormData();
		formData.append("fromMe", true);
		medias.forEach(media => {
			formData.append("medias", media);
			formData.append("body", media.name);
		});

		try {
			await api.post(`/messages/${ticketId}`, formData);
		} catch (err) {
			toastError(err);
		}

		setLoading(false);
		setMedias([]);
	};



	const handleSendMessage = async () => {
		if (inputMessage.trim() === "") return;
		setLoading(true);

		const message = {
			read: 1,
			fromMe: true,
			mediaUrl: "",
			body: signMessage
				? `*${user?.name}:*\n${inputMessage.trim()}`
				: inputMessage.trim(),
			quotedMsg: replyingMessage,
		};
		try {
			await api.post(`/messages/${ticketId}`, message);
		} catch (err) {
			toastError(err);
		}

		setInputMessage("");
		setShowEmoji(false);
		setLoading(false);
		setReplyingMessage(null);
	};

	const handleStartRecording = async () => {
		setLoading(true);
		try {
			await navigator.mediaDevices.getUserMedia({ audio: true });
			await Mp3Recorder.start();
			setRecording(true);
			setLoading(false);
		} catch (err) {
			toastError(err);
			setLoading(false);
		}
	};

	const handleUploadAudio = async () => {
		setLoading(true);
		try {
			const [, blob] = await Mp3Recorder.stop().getMp3();
			if (blob.size < 10000) {
				setLoading(false);
				setRecording(false);
				return;
			}

			const formData = new FormData();
			const filename = `${new Date().getTime()}.mp3`;
			formData.append("medias", blob, filename);
			formData.append("body", filename);
			formData.append("fromMe", true);

			await api.post(`/messages/${ticketId}`, formData);
		} catch (err) {
			toastError(err);
		}

		setRecording(false);
		setLoading(false);
	};

	const handleCancelAudio = async () => {
		try {
			await Mp3Recorder.stop().getMp3();
			setRecording(false);
		} catch (err) {
			toastError(err);
		}
	};

	const renderReplyingMessage = message => {
		return (
			<div className={classes.replyginMsgWrapper}>
				<div className={classes.replyginMsgContainer}>
					<span
						className={clsx(classes.replyginContactMsgSideColor, {
							[classes.replyginSelfMsgSideColor]: !message.fromMe,
						})}
					></span>
					<div className={classes.replyginMsgBody}>
						{!message.fromMe && (
							<span className={classes.messageContactName}>
								{message.contact?.name}
							</span>
						)}
						{message.body}
					</div>
				</div>
				<IconButton
					aria-label="showRecorder"
					component="span"
					disabled={loading || ticketStatus !== "open"}
					onClick={() => setReplyingMessage(null)}
				>
					<ClearIcon className={classes.sendMessageIcons} />
				</IconButton>
			</div>
		);
	};

	if (medias.length > 0)
		return (
			<Paper elevation={0} square className={classes.viewMediaInputWrapper}>
				<IconButton
					aria-label="cancel-upload"
					component="span"
					onClick={e => setMedias([])}
				>
					<CancelIcon className={classes.sendMessageIcons} />
				</IconButton>

				{loading ? (
					<div>
						<CircularProgress className={classes.circleLoading} />
					</div>
				) : (
					<span>
						{medias[0]?.name}
						{/* <img src={media.preview} alt=""></img> */}
					</span>
				)}
				<IconButton
					aria-label="send-upload"
					component="span"
					onClick={handleUploadMedia}
					disabled={loading}
				>
					<SendIcon className={classes.sendMessageIcons} />
				</IconButton>
			</Paper>
		);
	else {
		return (
			<Paper square elevation={0} className={classes.mainWrapper}>
				{replyingMessage && renderReplyingMessage(replyingMessage)}
				<div className={classes.newMessageBox}>
					<IconButton
						aria-label="emojiPicker"
						component="span"
						disabled={loading || recording || ticketStatus !== "open"}
						onClick={e => setShowEmoji(prevState => !prevState)}
					>
						<MoodIcon className={classes.sendMessageIcons} />
					</IconButton>
					{showEmoji ? (
						<div className={classes.emojiBox}>
							<Picker
								perLine={16}
								showPreview={false}
								showSkinTones={false}
								onSelect={handleAddEmoji}
							/>
						</div>
					) : null}

					<input
						multiple
						type="file"
						id="upload-button"
						disabled={loading || recording || ticketStatus !== "open"}
						className={classes.uploadInput}
						onChange={handleChangeMedias}
					/>
					<label htmlFor="upload-button">
						<IconButton
							aria-label="upload"
							component="span"
							disabled={loading || recording || ticketStatus !== "open"}
						>
							<AttachFileIcon className={classes.sendMessageIcons} />
						</IconButton>
					</label>
					<FormControlLabel
						style={{ marginRight: 7, color: "gray" }}
						label={i18n.t("messagesInput.signMessage")}
						labelPlacement="start"
						control={
							<Switch
								size="small"
								checked={signMessage}
								onChange={e => {
									setSignMessage(e.target.checked);
								}}
								name="showAllTickets"
								color="primary"
							/>
						}
					/>
					<div className={classes.messageInputWrapper}>
						<InputBase
							inputRef={input => {
								input && input.focus();
								input && (inputRef.current = input);
							}}
							className={classes.messageInput}
							placeholder={
								ticketStatus === "open"
									? i18n.t("messagesInput.placeholderOpen")
									: i18n.t("messagesInput.placeholderClosed")
							}
							multiline
							maxRows={5}
							value={inputMessage}
							onChange={handleChangeInput}
							disabled={recording || loading || ticketStatus !== "open"}
							onPaste={e => {
								ticketStatus === "open" && handleInputPaste(e);
							}}
							onKeyPress={e => {
								if (loading || e.shiftKey) return;
								else if (e.key === "Enter") {
									handleSendMessage();
								}
							}}
						/>
					</div>
					{inputMessage ? (
						<IconButton
							aria-label="sendMessage"
							component="span"
							onClick={handleSendMessage}
							disabled={loading}
						>
							<SendIcon className={classes.sendMessageIcons} />
						</IconButton>
					) : recording ? (
						<div className={classes.recorderWrapper}>
							<IconButton
								aria-label="cancelRecording"
								component="span"
								fontSize="large"
								disabled={loading}
								onClick={handleCancelAudio}
							>
								<HighlightOffIcon className={classes.cancelAudioIcon} />
							</IconButton>
							{loading ? (
								<div>
									<CircularProgress className={classes.audioLoading} />
								</div>
							) : (
								<RecordingTimer />
							)}

							<IconButton
								aria-label="sendRecordedAudio"
								component="span"
								onClick={handleUploadAudio}
								disabled={loading}
							>
								<CheckCircleOutlineIcon className={classes.sendAudioIcon} />
							</IconButton>
						</div>
					) : (
						<IconButton
							aria-label="showRecorder"
							component="span"
							disabled={loading || ticketStatus !== "open"}
							onClick={handleStartRecording}
						>
							<MicIcon className={classes.sendMessageIcons} />
						</IconButton>
					)}
				</div>
			</Paper>
		);
	}
};

export default MessageInput;
