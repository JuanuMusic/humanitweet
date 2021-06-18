import BN from "bn.js";
import React, { ChangeEventHandler } from "react";
import {
  FormControl,
  InputGroup,
  ModalBody,
  ModalTitle,
  Modal,
  Button,
} from "react-bootstrap";
import { Gem } from "react-bootstrap-icons";
import HumanitweetService from "../services/HumanitweetOnChainService";
import UBIService from "../services/UBIService";

interface ISupportTweetDialogProps extends IBaseHumanitweetProps {
  show: boolean;
  tweetTokenId: number;
  onClose?(): any;
}

interface ISupportTweetDialogState {
  amount?: string;
}

class SupportTweetDialog extends React.Component<
  ISupportTweetDialogProps,
  ISupportTweetDialogState
> {
  _currentUBIBalance: BN = new BN(0);
  constructor(props: ISupportTweetDialogProps) {
    super(props);
    this.state = {
      amount: "",
    };
  }

  componentDidMount() {
      this.initialize()
  }

  async initialize() {
    const balance = await UBIService.balanceOf(this.props.appState.account, this.props.drizzle)
    this._currentUBIBalance = new BN(balance);
  }

  handleClose = () => {
    this.props.onClose && this.props.onClose();
  };

  handleValueChanged = (e: any) => {
    let parsedAmount: number = parseInt(e.target.value, 10);
    if (Number.isInteger(parsedAmount)) {
      this.setState({ amount: e.target.value });
    } else if (e.target.value === undefined || e.target.value === "") {
      this.setState({ amount: "" });
    }
  };

  handleBurnUBIs = async () => {
    if (this.state.amount) {
      console.log((window as any).web3 as any);
      const parsedAmount = new BN(this.state.amount);

      if (parsedAmount.gt(new BN(0)) && parsedAmount.lte(this._currentUBIBalance)) {
        await HumanitweetService.giveSupport(
          this.props.tweetTokenId,
          parsedAmount,
          this.props.appState.account,
          this.props.drizzle
        );
      }
    }
  };

  private _isConfirmButtonEnabled() {
    if (this.state.amount === undefined || this.state.amount === null)
      return false;

    let parsedAmount= new BN(this.state.amount);
    return parsedAmount.gt(new BN(0)) && parsedAmount.lte(this._currentUBIBalance);
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.handleClose} centered>
        <Modal.Header>
          <Modal.Title>Support tweet {this.props.tweetTokenId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-2 mr-sm-2">
            <InputGroup.Prepend>
              <InputGroup.Text>
                <Gem />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              id="ubiToBurn"
              placeholder="Amount of UBIs to burn"
              value={this.state.amount}
              onChange={this.handleValueChanged}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={!this._isConfirmButtonEnabled()}
            onClick={this.handleBurnUBIs}
          >
            Burn baby, burn...
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default SupportTweetDialog;
