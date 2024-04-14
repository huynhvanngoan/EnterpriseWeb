import React from "react";
import { Modal, Button } from "antd";
import "./ModalTerms.css";
const ModalTerms = ({ visible, onOk, onCancel }) => {
    return (
        <Modal
            title="Terms and Conditions"
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            style={{ height: "50vh" }}
            okText="Agree"
            cancelText="Disagree"
            okButtonProps={{
                style: { background: "#008000" },
            }}
        >
            <div style={{ maxHeight: "54vh", overflowY: "auto" }}>
                <p>
                    <strong>Acceptance of Terms:</strong> By uploading articles
                    to the university platform, you agree to abide by these
                    Terms and Conditions. If you do not agree with any part of
                    these terms, you may not upload articles to the platform.
                </p>
                <p>
                    <strong>Ownership of Content:</strong> You retain ownership
                    of any articles you upload to the platform. However, by
                    uploading content, you grant the university a non-exclusive,
                    royalty-free, perpetual, and worldwide license to use,
                    reproduce, modify, adapt, publish, translate, distribute,
                    and display the content for educational and promotional
                    purposes related to the university.
                </p>
                <p>
                    <strong>Intellectual Property Rights:</strong> You represent
                    and warrant that you have all necessary rights, licenses,
                    and permissions to upload the articles to the platform and
                    grant the university the rights specified in these Terms and
                    Conditions. You agree not to upload any content that
                    infringes upon the intellectual property rights of others.
                </p>
                <p>
                    <strong>Content Guidelines:</strong> You agree to upload
                    only articles that are original and do not violate any laws
                    or regulations. You agree not to upload content that is
                    defamatory, obscene, offensive, or otherwise inappropriate.
                </p>
                <p>
                    <strong>Responsibility for Content:</strong> You are solely
                    responsible for the articles you upload to the platform. The
                    university does not endorse any content uploaded by users
                    and disclaims all liability for any content uploaded to the
                    platform.
                </p>
                <p>
                    <strong>Privacy:</strong> The university will collect and
                    process personal data in accordance with applicable privacy
                    laws and the university's Privacy Policy. By uploading
                    articles to the platform, you consent to the collection,
                    processing, and use of your personal data as described in
                    the Privacy Policy.
                </p>
                <p>
                    <strong>Security:</strong> You agree not to upload any
                    content that contains viruses, malware, or any other harmful
                    code. You also agree not to attempt to gain unauthorized
                    access to the platform or interfere with its operation in
                    any way.
                </p>
                <p>
                    <strong>Termination:</strong> The university reserves the
                    right to suspend or terminate your access to the platform at
                    any time, without prior notice, if you violate these Terms
                    and Conditions or for any other reason.
                </p>
                <p>
                    <strong>Modification of Terms:</strong> The university
                    reserves the right to modify these Terms and Conditions at
                    any time. Any changes will be effective immediately upon
                    posting on the platform. Your continued use of the platform
                    after such changes constitutes your acceptance of the
                    modified terms.
                </p>
            </div>
        </Modal>
    );
};

export default ModalTerms;
