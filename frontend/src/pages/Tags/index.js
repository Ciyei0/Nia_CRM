import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useContext,
} from "react";
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
import StarIcon from "@material-ui/icons/Star";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import TagModal from "../../components/TagModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { Chip } from "@material-ui/core";
import { Tooltip } from "@material-ui/core";
import { SocketContext } from "../../context/Socket/SocketContext";
import { AuthContext } from "../../context/Auth/AuthContext";

const reducer = (state, action) => {
  if (action.type === "LOAD_TAGS") {
    const tags = action.payload;
    const newTags = [];

    tags.forEach((tag) => {
      const tagIndex = state.findIndex((s) => s.id === tag.id);
      if (tagIndex !== -1) {
        state[tagIndex] = tag;
      } else {
        newTags.push(tag);
      }
    });

    return [...state, ...newTags];
  }

  if (action.type === "UPDATE_TAGS") {
    const tag = action.payload;
    const tagIndex = state.findIndex((s) => s.id === tag.id);

    if (tagIndex !== -1) {
      state[tagIndex] = tag;
      return [...state];
    } else {
      return [tag, ...state];
    }
  }

  if (action.type === "DELETE_TAG") {
    const tagId = action.payload;

    const tagIndex = state.findIndex((s) => s.id === tagId);
    if (tagIndex !== -1) {
      state.splice(tagIndex, 1);
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
    backgroundColor: "#3b5bdb",
    color: "white",
    borderRadius: "50px",
    padding: "8px 20px",
    fontWeight: "bold",
    textTransform: "uppercase",
    "&:hover": {
      backgroundColor: "#2c48b5",
    },
  },
  colorPill: {
    width: "60px",
    height: "20px",
    borderRadius: "10px",
    margin: "0 auto",
  },
  tableHeader: {
    fontWeight: "bold",
    color: "#555",
  },
  iconButton: {
    color: "#757575",
  },
  tagChip: {
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: 600,
    fontSize: "13px",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  defaultBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "4px 10px",
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 600,
    marginLeft: 8,
  },
  starIcon: {
    fontSize: 14,
    color: "#ffc107",
  },
}));

const Tags = () => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [deletingTag, setDeletingTag] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [tags, dispatch] = useReducer(reducer, []);
  const [tagModalOpen, setTagModalOpen] = useState(false);

  const fetchTags = useCallback(async () => {
    try {
      const { data } = await api.get("/tags/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_TAGS", payload: data.tags });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  }, [searchParam, pageNumber]);

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchTags();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber, fetchTags]);

  useEffect(() => {
    const socket = socketManager.getSocket(user.companyId);

    socket.on("user", (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_TAGS", payload: data.tags });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_USER", payload: +data.tagId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketManager, user]);

  const handleOpenTagModal = () => {
    setSelectedTag(null);
    setTagModalOpen(true);
  };

  const handleCloseTagModal = () => {
    setSelectedTag(null);
    setTagModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditTag = (tag) => {
    setSelectedTag(tag);
    setTagModalOpen(true);
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await api.delete(`/tags/${tagId}`);
      toast.success(i18n.t("tags.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingTag(null);
    setSearchParam("");
    setPageNumber(1);

    dispatch({ type: "RESET" });
    setPageNumber(1);
    await fetchTags();
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

  return (
    <MainContainer>
      <ConfirmationModal
        title={deletingTag && `${i18n.t("tags.confirmationModal.deleteTitle")}`}
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteTag(deletingTag.id)}
      >
        {i18n.t("tags.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <TagModal
        open={tagModalOpen}
        onClose={handleCloseTagModal}
        reload={fetchTags}
        aria-labelledby="form-dialog-title"
        tagId={selectedTag && selectedTag.id}
      />
      <MainHeader>
        <Title>{i18n.t("tags.title")}</Title>
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
            onClick={handleOpenTagModal}
          >
            {i18n.t("tags.buttons.add")}
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
              <TableCell align="center" className={classes.tableHeader} style={{ width: '50px' }}>ID</TableCell>
              <TableCell align="center" className={classes.tableHeader}>{i18n.t("tags.table.name")}</TableCell>
              <TableCell align="center" className={classes.tableHeader}>
                Color <span style={{ marginLeft: 5, fontSize: 12, cursor: 'help' }} title="Color de la etiqueta">ⓘ</span>
              </TableCell>
              <TableCell align="center" className={classes.tableHeader}>
                Comportamiento
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {tags.map((tag, index) => (
                <TableRow key={tag.id} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                  <TableCell align="center" style={{ fontWeight: 'bold', color: '#666' }}>
                    {tag.id}
                  </TableCell>
                  <TableCell align="center">
                    <span
                      className={classes.tagChip}
                      style={{ backgroundColor: tag.color || "#666" }}
                    >
                      {tag.name}
                    </span>
                    {tag.isDefault && (
                      <span className={classes.defaultBadge}>
                        <StarIcon className={classes.starIcon} />
                        Predeterminada
                      </span>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={tag.color || "Sin color"} arrow>
                      <div className={classes.colorPill} style={{ backgroundColor: tag.color }} />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleEditTag(tag)} className={classes.iconButton}>
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setConfirmModalOpen(true);
                        setDeletingTag(tag);
                      }}
                      className={classes.iconButton}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton columns={3} />}
            </>
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Tags;
