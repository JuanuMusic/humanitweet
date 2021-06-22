import React, { ChangeEventHandler, useEffect, useState } from "react";
import {
  FormControl,
  InputGroup,
  ModalBody,
  ModalTitle,
  Modal,
  Button,
} from "react-bootstrap";
import { Gem } from "react-bootstrap-icons";
import HumanitweetService from "../services/HumanitweetService";
import UBIService from "../services/UBIService";
import { Web3Provider } from "@ethersproject/providers";
import { BigNumber, ethers, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";
import contractProvider from "../services/ContractProvider";

interface ISupportTweetDialogProps extends IBaseHumanitweetProps {
  show: boolean;
  tweetTokenId: number;
  onClose?(): any;
}

interface ISupportTweetDialogState {
  amount?: string;
}

/**
 * Hook that updates the current UBI balance.
 * @param address
 * @returns
 */
function useUBIBalance(address: string) {
  const context = useWeb3React<Web3Provider>();
  const [currentUBIBalance, setCurrentUBIBalance] = useState(BigNumber.from(0));
  useEffect(() => {
    if (!address) return;
    async function getBalance() {
      const balance = await UBIService.balanceOf(
        address,
        new ethers.providers.Web3Provider(context.library?.provider!)
      );
      console.log("NEW BALANCE", balance);
      setCurrentUBIBalance(balance);
    }

    getBalance();
  }, [address]);

  return currentUBIBalance;
}

function SupportTweetDialog(props: ISupportTweetDialogProps) {
  const [amount, setAmount] = useState("");
  const currentUBIBalance = useUBIBalance(props.human.address);
  const context = useWeb3React<Web3Provider>();

  const handleClose = () => {
    props.onClose && props.onClose();
  };

  const handleBurnUBIs = async () => {
    if (amount) {
      const parsedAmount = utils.parseEther(amount);

      if (
        parsedAmount.gt(BigNumber.from("0")) &&
        parsedAmount.lte(currentUBIBalance)
      ) {
        await HumanitweetService.giveSupport(
          props.tweetTokenId,
          parsedAmount,
          props.human.address,
          new ethers.providers.Web3Provider(context.library?.provider!)
        );
      }
    }
  };

  const handleAmountChanged = (e: any) => {
    let parsedAmount: number = parseFloat(e.target.value);
    if (Number.isSafeInteger(parsedAmount)) {
      setAmount(e.target.value);
    } else if (e.target.value === undefined || e.target.value === "") {
      setAmount("");
    }
  };

  const _isConfirmButtonEnabled = () => {
    if (!amount) return false;
    console.log("AMOUNT", amount);
    let parsedAmount = BigNumber.from(amount);
    return (
      parsedAmount.gt(BigNumber.from(0)) && parsedAmount.lte(currentUBIBalance)
    );
  };

  return (
    <Modal show={props.show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Support tweet {props.tweetTokenId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        UBI Balance: {currentUBIBalance.toString()}
        <InputGroup className="mb-2 mr-sm-2">
          <InputGroup.Prepend>
            <InputGroup.Text>
              <Gem />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            id="ubiToBurn"
            placeholder="Amount of UBIs to burn"
            value={amount?.toString()}
            onChange={handleAmountChanged}
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={!_isConfirmButtonEnabled()} onClick={handleBurnUBIs}>
          Burn baby, burn...
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SupportTweetDialog;
