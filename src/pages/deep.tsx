import React, { useState, useEffect } from "react";
import EventEmitter from "events";
import Layout from "../components/Layout";
import { Grid, Typography, Box, Button, Dialog, DialogTitle, DialogActions, DialogContent, Avatar, Link } from "@material-ui/core";
import Warning from "@material-ui/icons/Warning";
import {
  isMobile
} from "react-device-detect";
import useQueryParams from "../hooks/useQueryString";

interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

interface EthereumProvider extends EventEmitter {
  isMetaMask?: boolean;
  request: (args: RequestArguments) => Promise<unknown>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const getShortenedUrl = (url: string) => {
  return url.substring(0, 140) + '[...]' + url.substring(url.length - 140, url.length - 1);
}

interface IProps {

}

const Deep: React.FC<IProps> = (props) => {
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [queryParams] = useQueryParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasEthereum = window.ethereum && window.ethereum.isMetaMask;
      setShowInstallDialog(!hasEthereum);
    }
  }, [])

  useEffect(() => {
    if (isMobile && !window.ethereum) {
      const url = window.location.href;
      const urlWithoutProtocol = url.replace(/(^\w+:|^)\/\//, '');
      window.location.href = `https://metamask.app.link/dapp/${urlWithoutProtocol}`;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && queryParams && queryParams.method) {
      window.ethereum?.request(queryParams).then(console.log);
    }
  }, []);

  return (
    <Layout>
      <Grid container justify="center" alignItems="center" direction="column" style={{marginTop: "10%"}}>
        <Grid item>
          <img
            alt="logo"
            height="150"
            style={{
              marginTop: "6px",
            }}
            src={"https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"} />
        </Grid>
        <Grid item style={{marginBottom: "50px"}}>
          <Typography variant="h3">View and approve request on MetaMask</Typography>
        </Grid>
        <Grid item>
          <Link href={window.location.protocol + '//' + window.location.host + window.location.search}>Create your own link</Link>
        </Grid>
      </Grid>
      <Dialog open={showInstallDialog} onClose={() => setShowInstallDialog(false)}>
        <DialogTitle>
          <div style={{ display: "flex" }}>
            <div style={{ marginTop: "6px", marginLeft: "6px" }}>
              <Warning />
            </div>
            <Typography variant="h5" style={{ marginTop: "8px", marginLeft: "6px" }}>
              MetaMask Not Detected
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>Install MetaMask for your platform and refresh the page.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
          <Button startIcon={<Avatar src={"https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"} style={{ opacity: "0.9", height: "24px", width: "24px" }} />} variant="contained" color="primary" href="https://metamask.io/download.html" target="_blank">Download MetaMask</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Deep;
