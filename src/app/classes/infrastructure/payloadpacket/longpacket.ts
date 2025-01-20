export class LongPacket
{
    T: string = '';
    V: number = 0;

    public Serialize = () => JSON.stringify(this);
    public Deserialize = (input: string) => JSON.parse(input) as LongPacket;
}

export class LongPacketWrapper
{
    Topic: string = '';
    LongPacket: LongPacket = null as any;

    public static Create(topic: string, longPacket: LongPacket)
    {
        let result = new LongPacketWrapper();
        result.Topic = topic;
        result.LongPacket = longPacket;

        return result;
    }
}