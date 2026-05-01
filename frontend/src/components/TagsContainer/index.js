import { Chip, Paper, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useRef, useState } from "react";
import { isArray, isString } from "lodash";
import toastError from "../../errors/toastError";
import api from "../../services/api";

export function TagsContainer({ ticket }) {

    const [tags, setTags] = useState([]);
    const [selecteds, setSelecteds] = useState([]);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    useEffect(() => {
        if (isMounted.current) {
            loadTags().then(() => {
                if (Array.isArray(ticket.tags)) {
                    setSelecteds(ticket.tags);
                } else {
                    setSelecteds([]);
                }
            });
        }
    }, [ticket]);

    const createTag = async (data) => {
        try {
            const { data: responseData } = await api.post(`/tags`, data);
            return responseData;
        } catch (err) {
            toastError(err);
        }
    }

    const loadTags = async () => {
        try {
            const { data } = await api.get(`/tags/list`);
            setTags(data);
        } catch (err) {
            toastError(err);
        }
    }

    const syncTags = async (data) => {
        try {
            const { data: responseData } = await api.post(`/tags/sync`, data);
            return responseData;
        } catch (err) {
            toastError(err);
        }
    }

    const onChange = async (value, reason) => {
        let optionsChanged = [];
        
        if (isArray(value)) {
            for (let item of value) {
                if (isString(item)) {
                    // Check if tag already exists in the 'tags' list to avoid creating duplicates
                    const existingTag = tags.find(t => t.name.toLowerCase() === item.toLowerCase());
                    if (existingTag) {
                        optionsChanged.push(existingTag);
                    } else {
                        const newTag = await createTag({ name: item });
                        if (newTag) {
                            optionsChanged.push(newTag);
                        }
                    }
                } else {
                    optionsChanged.push(item);
                }
            }
        }
        
        // Remove duplicates just in case
        const uniqueOptions = optionsChanged.filter((option, index, self) =>
            index === self.findIndex((t) => t.id === option.id)
        );

        setSelecteds(uniqueOptions);
        await syncTags({ ticketId: ticket.id, tags: uniqueOptions });
        await loadTags(); // Refresh tags list
    }

    return (
        <Paper style={{ padding: 12 }}>
            <Autocomplete
                multiple
                size="small"
                options={tags}
                value={selecteds}
                freeSolo
                onChange={(e, v, r) => onChange(v, r)}
                getOptionLabel={(option) => option.name || option}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            variant="outlined"
                            style={{
                                background: option.color || '#eee',
                                color: "#FFF",
                                marginRight: 1,
                                fontWeight: 600,
                                borderRadius: 3,
                                fontSize: "0.8em",
                                whiteSpace: "nowrap"
                            }}
                            label={option.name ? option.name.toUpperCase() : option.toUpperCase()}
                            {...getTagProps({ index })}
                            size="small"
                        />
                    ))
                }
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" placeholder="Tags" />
                )}
                PaperComponent={({ children }) => (
                    <Paper style={{ width: 400, marginLeft: 12 }}>
                        {children}
                    </Paper>
                )}
            />
        </Paper>
    )
}