import {
    Body,
    Button,
    Column,
    Container,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";
import * as React from "react";

type EmailProps = {
    userName?: string;
    userImage?: string;
    invitedByEmail?: string;
    inviteLink?: string;
    jobImg?: string;
};

export default function Email({ userName, inviteLink, jobImg }: EmailProps) {
    return (
        <Html>
            <Tailwind>
                <Preview>New job incoming</Preview>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            <strong>Worker</strong> sent a new job your way!
                        </Heading>
                        <Section>
                            <Row>
                                <Column align="center">
                                    <Img
                                        src={`${jobImg}`}
                                        width="350"
                                        height="250"
                                        alt="picture of job!"
                                    />
                                </Column>
                            </Row>
                        </Section>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                pX={20}
                                pY={12}
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center"
                                href={inviteLink}
                            >
                                Check project
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            or copy and paste this URL into your browser:{" "}
                            <Link href={inviteLink} className="text-blue-600 no-underline">
                                {inviteLink}
                            </Link>
                        </Text>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            This invitation was intended for{" "}
                            <span className="text-black">{userName} </span>.This invite was
                            sent from{" "}
                            <span className="text-black">
                                If you were not expecting this invitation, you can ignore this
                                email. If you are concerned about your account's safety, please
                                reply to this email to get in touch with us.
                            </span>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
