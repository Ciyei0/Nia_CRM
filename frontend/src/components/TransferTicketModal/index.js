import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete, {
	createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import ButtonWithSpinner from "../ButtonWithSpinner";
import toastError from "../../errors/toastError";

const filterOptions = createFilterOptions({
	trim: true,
});

const TransferTicketModal = ({ modalOpen, onClose, ticketid }) => {
	const history = useHistory();
	const [selectedQueue, setSelectedQueue] = useState(null);
	const [queues, setQueues] = useState([]);
	const [tab, setTab] = useState(0);

	useEffect(() => {
		if (tab === 1) {
			const fetchQueues = async () => {
				try {
					const { data } = await api.get("/queue");
					setQueues(data);
				} catch (err) {
					toastError(err);
				}
			};
			fetchQueues();
		}
	}, [tab]);

	useEffect(() => {
		if (!modalOpen || searchParam.length < 3) {
			setLoading(false);
			return;
		}
		setLoading(true);
		const delayDebounceFn = setTimeout(() => {
			const fetchUsers = async () => {
				try {
					const { data } = await api.get("/users/", {
						params: { searchParam },
					});
					setOptions(data.users);
					setLoading(false);
				} catch (err) {
					setLoading(false);
					toastError(err);
				}
			};

			fetchUsers();
		}, 500);
		return () => clearTimeout(delayDebounceFn);
	}, [searchParam, modalOpen]);

	const handleClose = () => {
		onClose();
		setSearchParam("");
		setSelectedUser(null);
		setSelectedQueue(null);
		setTab(0);
	};

	const handleSaveTicket = async e => {
		e.preventDefault();
		if (!ticketid) return;
		if (tab === 0 && !selectedUser) return;
		if (tab === 1 && !selectedQueue) return;

		setLoading(true);
		try {
			const data = {};
			if (tab === 0) {
				data.userId = selectedUser.id;
				data.queueId = null; // Option: keep queueId? Usually transferring to user might implies same queue or no queue restriction. 
				// The original code passed `queueId: null`. I will stick to that or better yet, not send it if I want to keep current queue. 
				// But original code: `queueId: null`.
				data.status = "open";
			} else {
				data.queueId = selectedQueue.id;
				data.userId = null;
				data.status = "pending"; // Return to pending for auto-assignment
			}

			await api.put(`/tickets/${ticketid}`, data);
			setLoading(false);
			history.push(`/tickets`);
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
	};

	return (
		<Dialog open={modalOpen} onClose={handleClose} maxWidth="lg" scroll="paper">
			<form onSubmit={handleSaveTicket}>
				<DialogTitle id="form-dialog-title">
					{i18n.t("transferTicketModal.title")}
				</DialogTitle>
				<DialogContent dividers>
					<Tabs
						value={tab}
						onChange={(e, v) => setTab(v)}
						indicatorColor="primary"
						textColor="primary"
						variant="fullWidth"
						style={{ marginBottom: 20 }}
					>
						<Tab label="Agente" />
						<Tab label="Departamento" />
					</Tabs>
					{tab === 0 && (
						<Autocomplete
							style={{ width: 300, margin: "auto" }}
							getOptionLabel={option => `${option.name}`}
							onChange={(e, newValue) => {
								setSelectedUser(newValue);
							}}
							options={options}
							filterOptions={filterOptions}
							freeSolo
							autoHighlight
							noOptionsText={i18n.t("transferTicketModal.noOptions")}
							loading={loading}
							renderInput={params => (
								<TextField
									{...params}
									label={i18n.t("transferTicketModal.fieldLabel")}
									variant="outlined"
									required
									autoFocus
									onChange={e => setSearchParam(e.target.value)}
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<React.Fragment>
												{loading ? (
													<CircularProgress color="inherit" size={20} />
												) : null}
												{params.InputProps.endAdornment}
											</React.Fragment>
										),
									}}
								/>
							)}
						/>
					)}
					{tab === 1 && (
						<Autocomplete
							style={{ width: 300, margin: "auto" }}
							getOptionLabel={option => `${option.name}`}
							onChange={(e, newValue) => {
								setSelectedQueue(newValue);
							}}
							options={queues}
							autoHighlight
							noOptionsText={i18n.t("transferTicketModal.noOptions")}
							loading={loading}
							renderInput={params => (
								<TextField
									{...params}
									label="Departamento"
									variant="outlined"
									required
									autoFocus
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<React.Fragment>
												{loading ? (
													<CircularProgress color="inherit" size={20} />
												) : null}
												{params.InputProps.endAdornment}
											</React.Fragment>
										),
									}}
								/>
							)}
						/>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleClose}
						color="secondary"
						disabled={loading}
						variant="outlined"
					>
						{i18n.t("transferTicketModal.buttons.cancel")}
					</Button>
					<ButtonWithSpinner
						variant="contained"
						type="submit"
						color="primary"
						loading={loading}
					>
						{i18n.t("transferTicketModal.buttons.ok")}
					</ButtonWithSpinner>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default TransferTicketModal;
