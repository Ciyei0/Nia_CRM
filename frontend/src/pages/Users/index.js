import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import UserStatusIcon from "../../components/UserModal/statusIcon";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import UserModal from "../../components/UserModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { SocketContext } from "../../context/Socket/SocketContext";



const reducer = (state, action) => {
  if (action.type === "LOAD_USERS") {
    const users = action.payload;
    const newUsers = [];

    users.forEach((user) => {
      const userIndex = state.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        state[userIndex] = user;
      } else {
        newUsers.push(user);
      }
    });

    return [...state, ...newUsers];
  }

  if (action.type === "UPDATE_USERS") {
    const user = action.payload;
    const userIndex = state.findIndex((u) => u.id === user.id);

    if (userIndex !== -1) {
      state[userIndex] = user;
      return [...state];
    } else {
      return [user, ...state];
    }
  }

  if (action.type === "DELETE_USER") {
    const userId = action.payload;

    const userIndex = state.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      state.splice(userIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: "50px",
    padding: "5px 15px",
    marginRight: "10px",
  },
  searchInput: {
    border: "none",
    backgroundColor: "transparent",
    outline: "none",
    marginLeft: "10px",
    width: "150px",
  },
  addButton: {
    backgroundColor: "#2563eb",
    color: "white",
    borderRadius: "50px",
    padding: "8px 20px",
    fontWeight: "bold",
    textTransform: "uppercase",
    "&:hover": {
      backgroundColor: "#1d4ed8",
    },
  },
  tableHeader: {
    fontWeight: "bold",
    color: "#555",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "10px",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
  },
  nameContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative" // For status dot
  },
  statusDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#44b700", // Online color
    border: "2px solid white",
    position: "absolute",
    bottom: 0,
    left: 28, // Adjust based on avatar size
  },
  iconButton: {
    color: "#757575",
  },
}));

const Users = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [users, dispatch] = useReducer(reducer, []);

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchUsers = async () => {
        try {
          const { data } = await api.get("/users/", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_USERS", payload: data.users });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-user`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_USERS", payload: data.user });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_USER", payload: +data.userId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  const handleOpenUserModal = () => {
    setSelectedUser(null);
    setUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setSelectedUser(null);
    setUserModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      toast.success(i18n.t("users.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingUser(null);
    setSearchParam("");
    setPageNumber(1);
  };

  const loadMore = () => {
    setPageNumber((prevState) => prevState + 1);
  };

  const handleScroll = (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  const getRandomColor = (name) => {
    // Simple hash for consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + "00000".substring(0, 6 - c.length) + c;
  }


  return (
    <MainContainer>
      <ConfirmationModal
        title={
          deletingUser &&
          `${i18n.t("users.confirmationModal.deleteTitle")} ${deletingUser.name
          }?`
        }
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteUser(deletingUser.id)}
      >
        {i18n.t("users.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <UserModal
        open={userModalOpen}
        onClose={handleCloseUserModal}
        aria-labelledby="form-dialog-title"
        userId={selectedUser && selectedUser.id}
      />
      <MainHeader>
        <Title>{i18n.t("users.title")}</Title>
        <MainHeaderButtonsWrapper>
          <div className={classes.searchContainer}>
            <SearchIcon style={{ color: "gray" }} />
            <input
              className={classes.searchInput}
              placeholder={i18n.t("contacts.searchPlaceholder")}
              type="search"
              value={searchParam}
              onChange={handleSearch}
            />
          </div>
          <Button
            className={classes.addButton}
            onClick={handleOpenUserModal}
          >
            {i18n.t("users.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper
        className={classes.mainPaper}
        variant="outlined"
        onScroll={handleScroll}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" className={classes.tableHeader}>{i18n.t("users.table.name")}</TableCell>
              <TableCell align="center" className={classes.tableHeader}>{i18n.t("users.table.profile")}</TableCell>
              <TableCell align="center" className={classes.tableHeader}>
                {i18n.t("users.table.email")}
              </TableCell>
              <TableCell align="center" className={classes.tableHeader}>
                Ultima vez visto
              </TableCell>
              <TableCell align="center" className={classes.tableHeader}>
                {i18n.t("users.table.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {users.map((user, index) => (
                <TableRow key={user.id} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#fbfbfb" }}>
                  <TableCell align="center">
                    <div className={classes.nameContainer}>
                      <div className={classes.avatar} style={{ backgroundColor: "#ccc" }}>{getInitials(user.name)}</div>
                      {user.online && <div className={classes.statusDot} />}
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell align="center">{user.profile}</TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.updatedAt}</TableCell> {/* Placeholder for Last Seen */}
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditUser(user)}
                      className={classes.iconButton}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setConfirmModalOpen(true);
                        setDeletingUser(user);
                      }}
                      className={classes.iconButton}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton columns={5} />}
            </>
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Users;
