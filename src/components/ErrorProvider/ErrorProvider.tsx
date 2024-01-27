"use client";

import { CloseOutlined } from "@mui/icons-material";
import { DialogContent, DialogTitle, IconButton, Modal, ModalDialog, Typography } from "@mui/joy";
import { Component } from "react";
import { ErrorContext } from "./ErrorContext";
import { ProviderContext } from "./types";

interface State {
    error: string;
    contextValue: ProviderContext
}
interface ErrorProviderProps {
    children?: React.ReactNode | React.ReactNode[];
}

export let showError: ProviderContext['showError'];

export default class ErrorProvider extends Component<ErrorProviderProps, State> {
    constructor(props: ErrorProviderProps) {
        super(props)
        showError = this.showError;
        this.state = {
            error: "",
            contextValue: {
                showError: this.showError.bind(this),
            }
        };
    }

    showError = (msg: string) => {
        this.setState({ error: msg })
    }

    render() {
        const { error, contextValue } = this.state;

        const handleClose = () => {
            this.setState({ error: "" });
        };

        return (
            <>
                <ErrorContext.Provider value={contextValue}></ErrorContext.Provider>
                {!!error &&
                    <Modal open={true}>
                        <ModalDialog>
                            <DialogTitle sx={{ paddingTop: 3, paddingBottom: .5 }}>
                                <IconButton size="sm" onClick={(e) => handleClose()} sx={{ position: 'absolute', right: 8, top: 8 }}>
                                    <CloseOutlined fontSize="small" />
                                </IconButton>
                                Error
                            </DialogTitle>
                            <DialogContent>
                                <Typography>
                                    {error}
                                </Typography>
                            </DialogContent>
                        </ModalDialog>
                    </Modal>
                }
            </>

        )
    }
}
