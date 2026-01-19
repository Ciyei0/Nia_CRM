import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Switch from "@material-ui/core/Switch";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import toastError from "../../errors/toastError";
import api from "../../services/api";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    avatar: {
        backgroundColor: "#1565C0",
        color: "white"
    },
    namecell: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },
    headerToggles: {
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem"
    }
});

export default function UserAssignment({
    selectedUsers,
    setSelectedUsers,
    autoAssignUsers,
    setAutoAssignUsers,
    autoAssignmentEnabled,
    setAutoAssignmentEnabled,
    assignOffline,
    setAssignOffline
}) {
    const classes = useStyles();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get("/users");
                setUsers(data.users);
                setLoading(false);
            } catch (err) {
                toastError(err);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleToggleUser = (userId) => {
        const isSelected = selectedUsers.includes(userId);
        if (isSelected) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleToggleAutoAssignUser = (userId) => {
        // If not in selectedUsers, maybe auto-select? For now, independent.
        const isSelected = autoAssignUsers.includes(userId);
        if (isSelected) {
            setAutoAssignUsers(autoAssignUsers.filter(id => id !== userId));
        } else {
            setAutoAssignUsers([...autoAssignUsers, userId]);
        }
    };

    return (
        <Paper elevation={0} variant="outlined">
            <div className={classes.headerToggles}>
                <div>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: "bold" }}>
                        Habilitar asignación automática
                    </Typography>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" color="textSecondary">
                            Al habilitar esta opción, se asignará automáticamente cada nuevo chat a un miembro del equipo.
                        </Typography>
                        <Switch
                            checked={autoAssignmentEnabled}
                            onChange={(e) => setAutoAssignmentEnabled(e.target.checked)}
                            color="primary"
                        />
                    </div>
                </div>

                <div style={{ marginTop: "10px" }}>
                    <Typography variant="subtitle1" gutterBottom color="textSecondary">
                        Asignar a usuarios fuera de línea
                    </Typography>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" color="textSecondary">
                            Al habilitar esta opción, se asignará chats a los miembros disponibles y no disponibles del equipo.
                        </Typography>
                        <Switch
                            checked={assignOffline}
                            onChange={(e) => setAssignOffline(e.target.checked)}
                            color="primary"
                        />
                    </div>
                </div>
            </div>

            <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Asignar usuario al departamento</TableCell>
                            <TableCell align="center">Asignar chats automáticamente</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell component="th" scope="row">
                                    <div className={classes.namecell}>
                                        <Avatar className={classes.avatar}>{user.name.charAt(0)}</Avatar>
                                        <Typography>{user.name}</Typography>
                                    </div>
                                </TableCell>
                                <TableCell align="center">{user.email}</TableCell>
                                <TableCell align="center">
                                    <Switch
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleToggleUser(user.id)}
                                        color="primary"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Switch
                                        checked={autoAssignUsers.includes(user.id)}
                                        onChange={() => handleToggleAutoAssignUser(user.id)}
                                        disabled={!selectedUsers.includes(user.id)}
                                        color="primary"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
