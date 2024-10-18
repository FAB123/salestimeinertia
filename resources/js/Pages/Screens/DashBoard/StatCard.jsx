import React from "react";

import { IconArrowUpRight } from "@tabler/icons-react";

const StatCard = ({ label, stats, color, progress }) => {
    return (
        <h1>d</h1>
        // <SimpleGrid breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
        //     <Paper withBorder radius="md" p="xs" key={label}>
        //         <Group>
        //             <RingProgress
        //                 size={80}
        //                 roundCaps
        //                 thickness={8}
        //                 sections={[{ value: progress, color: color }]}
        //                 label={
        //                     <Center>
        //                         <IconArrowUpRight size="1.4rem" stroke={1.5} />
        //                     </Center>
        //                 }
        //             />

        //             <div>
        //                 <Text
        //                     color="dimmed"
        //                     size="xs"
        //                     transform="uppercase"
        //                     weight={700}
        //                 >
        //                     {label}
        //                 </Text>
        //                 <Text weight={700} size="xl">
        //                     {stats}
        //                 </Text>
        //             </div>
        //         </Group>
        //     </Paper>
        // </SimpleGrid>
    );
};

export default StatCard;
