import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Button} from "antd";
import Modal from "antd/es/modal/Modal";

const ConfirmDelete = () => {
    return (
        <div>
            <Modal isOpen={true} isOpenX={"deleteWorkDay['show_modal']"} toggle={true} className="text-center" centered>
                <ModalHeader className="d-flex justify-center">
                    <h3 className="text-center">Delete Confirmation</h3>
                </ModalHeader>
                <ModalBody>
                    <h4>Do you really want to delete this work day ?</h4>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => "confirm_workday_deleting()"}><i className="fa fa-trash"/> Yes, Delete!</Button>
                    <Button color="secondary" onClick={() => {}}><i className="fa fa-times"/> Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default ConfirmDelete
