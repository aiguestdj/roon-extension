import MainLayout from "@aiguestdj/shared/layouts/MainLayout";
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Alert, Box, Button, CircularProgress, Divider, Sheet, Typography } from "@mui/joy";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Zone } from 'roon-kit';
import { GetProfileResponse } from "./api/profile";

const Page: NextPage = () => {

    const [loadingRoon, setLoadingRoon] = useState<boolean>(true)
    const [zones, setZones] = useState<Zone[]>([])
    const [profile, setProfile] = useState<GetProfileResponse>()

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

    return (<MainLayout type="roon">
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
            </Box>
        </Sheet>

    </MainLayout>
    )
}

export default Page;
