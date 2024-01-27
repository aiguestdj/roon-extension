import ErrorProvider from "@/components/ErrorProvider/ErrorProvider";
import { Container } from "@mui/joy";

interface MainLayoutProps {
    children: React.ReactNode,
}

export default function MainLayout(props: MainLayoutProps) {
    const { children } = props;
    return (
        <Container style={{ maxWidth: "100%", padding: 0 }}>
            <ErrorProvider />
            <Container style={{ maxWidth: "100%", padding: 0 }}>
                {children}
            </Container>
        </Container>
    )
}