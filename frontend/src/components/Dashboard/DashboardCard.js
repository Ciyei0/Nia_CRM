import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    card: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "hidden",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#1565C0", // Modern Blue theme
        color: "#eee",
        transition: "transform 0.3s",
        "&:hover": {
            transform: "scale(1.02)",
            boxShadow: theme.shadows[6]
        }
    },
    iconContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
}));

export default function DashboardCard(props) {
    const { icon, title, value, loading } = props;
    const classes = useStyles();

    if (loading) {
        return <Skeleton variant="rect" height={100} />; // Placeholder height
    }

    return (
        <Paper className={classes.card} elevation={4}>
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={8}>
                    <Typography component="h3" variant="h6" paragraph style={{ fontWeight: 500 }}>
                        {title}
                    </Typography>
                    <Grid item>
                        <Typography component="h1" variant="h4" style={{ fontWeight: "bold" }}>
                            {value}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={4} className={classes.iconContainer}>
                    {icon && React.cloneElement(icon, {
                        style: { fontSize: 64, color: "#fff", opacity: 0.8 }
                    })}
                </Grid>
            </Grid>
        </Paper>
    );
}
