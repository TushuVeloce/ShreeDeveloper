export class StringPacket
{
    T: string = '';
    V: string = '';

    public Serialize = () => JSON.stringify(this);
    public Deserialize = (input: string) => JSON.parse(input) as StringPacket;
}

export class StringPacketWrapper
{
    Topic: string = '';
    StringPacket: StringPacket = null as any;

    public static Create(topic: string, stringPacket: StringPacket)
    {
        let result = new StringPacketWrapper();
        result.Topic = topic;
        result.StringPacket = stringPacket;

        return result;
    }
}