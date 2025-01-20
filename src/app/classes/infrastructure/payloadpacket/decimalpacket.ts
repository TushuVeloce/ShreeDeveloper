export class DecimalPacket
{
    T: string = '';
    V: number = 0;

    public Serialize = () => JSON.stringify(this);
    public Deserialize = (input: string) => JSON.parse(input) as DecimalPacket;
}

export class DecimalPacketWrapper
{
    Topic: string = '';
    DecimalPacket: DecimalPacket = null as any;

    public static Create(topic: string, decimalPacket: DecimalPacket)
    {
        let result = new DecimalPacketWrapper();
        result.Topic = topic;
        result.DecimalPacket = decimalPacket;

        return result;
    }
}
