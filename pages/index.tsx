import { errorBoundary } from "@aiguestdj/shared";
import OpenAISettingsDialog from "@aiguestdj/shared/components/OpenAISettingsDialog";
import MainLayout from "@aiguestdj/shared/layouts/MainLayout";
import { EditOutlined } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Alert, Box, Button, CircularProgress, Divider, IconButton, Sheet, Typography } from "@mui/joy";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Zone } from 'roon-kit';
import { GetOpenAIProfileResponse } from "./api/openai/profile";
import { GetProfileResponse } from "./api/profile";

const Page: NextPage = () => {

    const [loadingRoon, setLoadingRoon] = useState<boolean>(true)
    const [zones, setZones] = useState<Zone[]>([])
    const [profile, setProfile] = useState<GetProfileResponse>()

    const [openAiError, setOpenAiError] = useState<boolean>(false);
    const [openAiProfile, setOpenAiProfile] = useState<GetOpenAIProfileResponse>();
    const [showOpenAiConfig, setShowOpenAiConfig] = useState<boolean>(false)
    // Roon
    useEffect(() => {
        let timeoutId: number = NaN;
        const getData = async () => {
            try {
                const result = await axios.get(`/api/zones`);
                if (result && result.data && result.data.length > 0) {
                    setZones(result.data);
                    const profile = await axios.get(`/api/profile`)
                    setProfile(profile.data)
                    setLoadingRoon(false);
                } else {
                    timeoutId = window.setTimeout(getData, 1000)
                }
            } catch (e) {

            }
        }
        getData()
        return () => {
            clearTimeout(timeoutId);
        }
    }, [])

    // Open AI
    useEffect(() => {
        errorBoundary(async () => {
            const openAIProfile = await axios.get(`/api/openai/profile`)
            setOpenAiProfile(openAIProfile.data)
        }, () => {
            setOpenAiError(true)
        }, true)
    }, [])
    return (<MainLayout>
        <Head>
            <title>AI Guest DJ | Designed for Roon</title>
        </Head>
        <Sheet sx={{ minHeight: "100vh" }} className="verticalCenter">
            <Box textAlign={"center"}>
                <Box display={"inline-block"} padding={'5px'} boxSizing={"border-box"} bgcolor={"var(--joy-palette-neutral-700)"} component={"span"} overflow={"hidden"} borderRadius={"50%"} width={120} height={120}>
                    <Box overflow={"hidden"} borderRadius={"50%"} width={110} height={110}>
                        <Image src={"/img/logo.png"} alt={"AI Guest DJ"} width={110} height={110} />
                    </Box>
                </Box>
                <Typography mb={2} level={"body-sm"}>Designed for Roon</Typography>

                {loadingRoon &&
                    <>
                        <CircularProgress size="sm" />
                        <Box display={'flex'} justifyContent={'center'}>

                            <Alert variant="outlined">Go to your Roon App and visit Settings &gt; Extensions <br />and enable the AI Guest DJ extension.</Alert>
                        </Box>
                    </>

                }
                {!loadingRoon &&
                    <>
                        <Button component="a" target="_blank" href={`${process.env.NEXT_PUBLIC_AIGUESTDJ_URL || "https://aiguestdj.com"}?roon=${window.location.href}`}>Connect AI Guest DJ</Button>
                        <Box maxWidth={600} margin={"0 auto"} pt={3} textAlign={"left"}>
                            <Divider sx={{ mb: 2 }} />
                            <Typography mb={1} level="h1">Roon</Typography>
                            <AccordionGroup variant="outlined">
                                <Accordion>
                                    <AccordionSummary>Connection details</AccordionSummary>
                                    <AccordionDetails>
                                        <Sheet color="neutral" variant="soft">
                                            <Box p={1}>
                                                <Typography mb={1} level={"h2"}>Zones</Typography>
                                                {zones.map(item => {
                                                    return <Typography key={item.zone_id} level="body-sm">{item.display_name}</Typography>
                                                })}
                                                <Typography mt={2} level={"h2"}>Profile</Typography>
                                                <Typography component={"div"} level="body-sm" mt={1} fontFamily={"monospace"} fontSize={"12px"} position={"relative"}>
                                                    <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{JSON.stringify(profile, undefined, 2)}</pre>
                                                </Typography>
                                            </Box>
                                        </Sheet>
                                    </AccordionDetails>
                                </Accordion>
                            </AccordionGroup>
                        </Box>
                    </>
                }
                {openAiError &&
                    <Box maxWidth={600} margin={"0 auto"} mt={2}>
                        <Alert color="danger" size="sm" variant="outlined">Open AI is not connected. Please update your API key and try again.</Alert>
                    </Box>
                }
                {!openAiError && openAiProfile &&
                    <Box maxWidth={600} margin={"0 auto"} mt={6} textAlign={"left"}>
                        <Divider sx={{ mb: 2 }} />
                        <Typography level="h1">Open AI API</Typography>
                        <Box display={'flex'} mb={2} mt={1} gap={1}>
                            <Button component={"a"} color="neutral" href={`/generate`} startDecorator={<Image src={"/img/icon-openai.svg"} alt="Open AI logo" width={20} height={20} />}>Create playlist via OpenAI</Button>
                            <IconButton variant="solid" color="warning" size="sm" onClick={() => setShowOpenAiConfig(true)}><EditOutlined fontSize="small" /></IconButton>
                        </Box>
                        <AccordionGroup variant="outlined">
                            <Accordion>
                                <AccordionSummary>History</AccordionSummary>
                                <AccordionDetails>
                                    <Sheet color="neutral" variant="soft">
                                        <Box p={1}>
                                            <Typography component={"div"} level="body-sm" mt={1} fontFamily={"monospace"} fontSize={"12px"} position={"relative"}>
                                                <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{JSON.stringify(openAiProfile.requests.reverse().slice(0, 10), undefined, 2)}</pre>
                                            </Typography>
                                        </Box>
                                    </Sheet>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionGroup>
                    </Box>
                }

            </Box>
        </Sheet>

        {showOpenAiConfig &&
            <OpenAISettingsDialog onClose={() => setShowOpenAiConfig(false)} />
        }
    </MainLayout>
    )
}

export default Page;
